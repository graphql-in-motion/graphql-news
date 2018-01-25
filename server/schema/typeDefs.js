import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { ObjectId } from 'mongodb';

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: GraphQLID },
    username: { type: GraphQLString },
    about: { type: GraphQLString },
  }),
});

export const commentsType = new GraphQLObjectType({
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

export const linkType = new GraphQLObjectType({
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
