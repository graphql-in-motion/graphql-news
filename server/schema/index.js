import { GraphQLID, GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList } from 'graphql';
import { ObjectId } from 'mongodb';
import { linkType, userType, commentsType } from './typeDefs';

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    allLinks: {
      type: new GraphQLList(linkType),
      resolve: async (_, data, { db: { Links } }) => await Links.find({}).toArray(),
    },
    link: {
      type: linkType,
      args: {
        _id: { type: GraphQLID },
      },
      resolve: async (_, { _id }, { db: { Links } }) => await Links.findOne(ObjectId(_id)),
    },
    allUsers: {
      type: new GraphQLList(userType),
      resolve: async (_, data, { db: { Users } }) => await Users.find({}).toArray(),
    },
    user: {
      type: userType,
      args: {
        _id: { type: GraphQLID },
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
        link: { type: GraphQLID },
        parent: { type: GraphQLID },
        content: { type: GraphQLString },
      },
      resolve: async (_, data, { db: { Comments } }) => {
        const response = await Comments.insert(data);

        return Object.assign({ _id: response.insertedIds[0] }, data);
      },
    },
    createLink: {
      type: linkType,
      args: {
        url: { type: GraphQLString },
        description: { type: GraphQLString },
      },
      resolve: async (_, data, { db: { Links } }) => {
        const link = Object.assign(
          {
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
        username: GraphQLString,
        authProvider: {
          email: GraphQLString,
          password: GraphQLString,
        },
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
      type: userType,
      args: {
        authProvider: {
          email: GraphQLString,
          password: GraphQLString,
        },
      },
      resolve: (_, { authProvider }, { db: { Users } }) => {
        const user = Users.findOne({ email: authProvider.email });

        if (authProvider.password === user.password) {
          return { token: `token-${user.email}`, user };
        }

        return null;
      },
    },
    upvoteLink: {
      type: linkType,
      args: {
        _id: { type: GraphQLID },
      },
      resolve: async (_, { _id }, { db: { Links } }) => {
        await Links.update({ _id: ObjectId(_id) }, { $inc: { score: 1 } });

        return Links.findOne(ObjectId(_id));
      },
    },
    downvoteLink: {
      type: linkType,
      args: {
        _id: { type: GraphQLID },
      },
      resolve: async (_, { _id }, { db: { Links } }) => {
        await Links.update({ _id: ObjectId(_id) }, { $inc: { score: -1 } });

        return Links.findOne(ObjectId(_id));
      },
    },
  }),
});

const graphQLSchemaConfig = {
  query: queryType,
  mutation: mutationType,
};

const schema = new GraphQLSchema(graphQLSchemaConfig);

export default schema;
