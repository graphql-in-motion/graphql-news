import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import { ObjectId } from 'mongodb';
import { PubSub } from 'graphql-subscriptions';
import { linkType, userType, commentsType, provider, signInPayload } from './typeDefs';

const pubsub = new PubSub();

const linkFilter = new GraphQLInputObjectType({
  name: 'linkFilter',
  fields: () => ({
    urlContains: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    allLinks: {
      type: new GraphQLList(linkType),
      args: {
        first: { type: GraphQLInt },
        skip: { type: GraphQLInt },
      },
      resolve: async (_, { first, skip }, { db: { Links } }) => {
        if (first && !skip) {
          return await Links.find({})
            .limit(first)
            .toArray();
        } else if (skip && !first) {
          return await Links.find({})
            .skip(skip)
            .toArray();
        } else if (skip && first) {
          return await Links.find({})
            .skip(skip)
            .limit(first)
            .toArray();
        }
        return await Links.find({}).toArray();
      },
    },
    link: {
      type: linkType,
      args: {
        // We must know a link's ID in order to query for it
        _id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { _id }, { db: { Links } }) => await Links.findOne(ObjectId(_id)),
    },
    filterLinks: {
      type: new GraphQLList(linkType),
      args: {
        filter: { type: linkFilter },
      },
      resolve: async (_, { filter }, { db: { Links } }) => {
        const { urlContains } = filter;

        return await Links.find({ url: { $regex: `.*${urlContains}.*` } }).toArray();
      },
    },
    allUsers: {
      type: new GraphQLList(userType),
      resolve: async (_, data, { db: { Users } }) => await Users.find({}).toArray(),
    },
    user: {
      type: userType,
      args: {
        // We must know a user's ID in order to query for him/her
        _id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { _id }, { db: { Users } }) => await Users.findOne(ObjectId(_id)),
    },
    allComments: {
      type: new GraphQLList(commentsType),
      resolve: async (_, data, { db: { Comments } }) => await Comments.find({}).toArray(),
    },
  }),
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createComment: {
      type: commentsType,
      args: {
        // Comments must have a parent link
        link: { type: new GraphQLNonNull(GraphQLID) },
        parent: { type: GraphQLID },
        // No empty comments
        content: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, data, { db: { Comments } }) => {
        const response = await Comments.insert(data);

        return Object.assign({ _id: response.insertedIds[0] }, data);
      },
    },
    createLink: {
      type: linkType,
      args: {
        // No empty URLs
        url: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
      },
      resolve: async (_, data, { db: { Links }, user }) => {
        const link = Object.assign(
          {
            author: user && user._id, // The signed in user is our author
            score: 0,
            comments: [],
          },
          data
        );

        const response = await Links.insert(link);

        return Object.assign({ _id: response.insertedIds[0] }, data);
      },
    },
    createUser: {
      type: userType,
      args: {
        // No empty usernames
        username: { type: new GraphQLNonNull(GraphQLString) },
        // We can't create a user without the proper credentials
        authProvider: { type: new GraphQLNonNull(provider) },
      },
      resolve: async (_, { username, authProvider }, { db: { Users } }) => {
        const newUser = {
          username,
          email: authProvider.email,
          password: authProvider.password,
        };
        const response = await Users.insert(newUser);

        return Object.assign({ _id: response.insertedIds[0] }, newUser);
      },
    },
    signInUser: {
      type: signInPayload,
      args: {
        // We can't sign in a user w/o credentials
        authProvider: { type: new GraphQLNonNull(provider) },
      },
      resolve: async (_, { authProvider }, { db: { Users } }) => {
        const user = await Users.findOne({ email: authProvider.email });

        if (authProvider.password === user.password) {
          return { token: `token-${user.email}`, user };
        }

        return null;
      },
    },
    upvoteLink: {
      type: linkType,
      args: {
        // We can't vote on a link w/o its ID
        _id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { _id }, { db: { Links } }) => {
        const link = await Links.findOneAndUpdate({ _id: ObjectId(_id) }, { $inc: { score: 1 } });

        const { score } = link.value;

        pubsub.publish('Vote', { 'Vote': { score: score + 1 } }); // eslint-disable-line prettier/prettier

        return Links.findOne(ObjectId(_id));
      },
    },
    downvoteLink: {
      type: linkType,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { _id }, { db: { Links } }) => {
        const link = await Links.findOneAndUpdate({ _id: ObjectId(_id) }, { $inc: { score: -1 } });

        const { score } = link.value;

        pubsub.publish('Vote', { 'Vote': { score: score - 1 } }); // eslint-disable-line prettier/prettier

        return Links.findOne(ObjectId(_id));
      },
    },
  }),
});

const subscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: () => ({
    Vote: {
      type: linkType,
      subscribe: () => pubsub.asyncIterator('Vote'),
    },
  }),
});

const graphQLSchemaConfig = {
  query: queryType,
  mutation: mutationType,
  subscription: subscriptionType,
};

const schema = new GraphQLSchema(graphQLSchemaConfig);

export default schema;
