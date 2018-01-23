import {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { ObjectId } from 'mongodb';

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: GraphQLID },
    username: { type: GraphQLString },
    about: { type: GraphQLString },
  }),
});

const commentsType = new GraphQLObjectType({
  name: 'Comments',
  fields: () => ({
    _id: { type: GraphQLID },
    link: {
      /**
       * Because of the way the lazy evaluation works on the `fields` object, we can reference the
       * Link type before it is defined
       */
      type: linkType, // eslint-disable-line no-use-before-define
      resolve: async ({ link }, data, { db: { Links } }) => await Links.findOne(ObjectId(link)),
    },
    parent: {
      type: commentsType,
      resolve: async ({ parent }, data, { db: { Comments } }) =>
        await Comments.findOne(ObjectId(parent)),
    },
    comments: {
      type: new GraphQLList(commentsType),
      args: {
        _id: { type: GraphQLID },
      },
      resolve: async ({ _id }, data, { db: { Comments } }) => {
        const comments = await Comments.find({}).toArray();
        return comments.filter(i => i.parent === _id.toString());
      },
    },
    author: {
      type: userType,
      args: {
        author: { type: GraphQLID },
      },
      resolve: async ({ author }, data, { db: { Users } }) => await Users.findOne(ObjectId(author)), // eslint-disable-line no-return-await
    },
    content: { type: GraphQLString },
  }),
});

const linkType = new GraphQLObjectType({
  name: 'Link',
  fields: () => ({
    _id: { type: GraphQLID },
    url: { type: GraphQLString },
    description: { type: GraphQLString },
    author: {
      type: userType,
      args: {
        author: { type: GraphQLID },
      },
      resolve: async (_, { author }, { db: { Users } }) => await Users.findOne(ObjectId(author)),
    },
    comments: {
      type: new GraphQLList(commentsType),
      resolve: async ({ _id }, data, { db: { Comments } }) => {
        const comments = await Comments.find({}).toArray();
        return comments.filter(i => i.parent === _id.toString());
      },
    },
    score: { type: GraphQLInt },
  }),
});

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
