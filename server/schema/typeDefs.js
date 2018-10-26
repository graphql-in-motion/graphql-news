import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import { ObjectId } from 'mongodb';

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    // _id should *never* be null
    _id: { type: new GraphQLNonNull(GraphQLID) },
    // No empty usernames
    username: { type: new GraphQLNonNull(GraphQLString) },
    about: { type: GraphQLString },
  }),
});

export const commentsType = new GraphQLObjectType({
  name: 'Comments',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    link: {
      // Because of the way the lazy evaluation works on the `fields` object, we can reference the
      // Link type before it is defined
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
      resolve: async ({ _id }, data, { db: { Comments } }) => {
        const comments = await Comments.find({}).toArray();
        return comments.filter(i => i.parent === _id.toString());
      },
    },
    author: {
      type: userType,
      args: {
        // We shouldn't be able to query for an author w/o knowing their ID
        author: { type: GraphQLID },
      },
      resolve: async ({ author }, data, { db: { Users } }) => await Users.findOne(ObjectId(author)),
    },
    // The body of the comment should be non-null. We don't want people posting empty comments
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const linkType = new GraphQLObjectType({
  name: 'Link',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    // No empty URLs
    url: { type: new GraphQLNonNull(GraphQLString) },
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

export const AuthProvider = new GraphQLInputObjectType({
  name: 'AuthProvider',
  fields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const signInPayload = new GraphQLObjectType({
  name: 'signInPayload',
  fields: {
    token: { type: new GraphQLNonNull(GraphQLString) },
    user: { type: new GraphQLNonNull(userType) },
  },
});
