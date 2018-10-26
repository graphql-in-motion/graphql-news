import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import { ObjectId } from 'mongodb';

import UserType from './user';
import CommentType from './comment';

export const LinkType = new GraphQLObjectType({
  name: 'Link',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    // No empty URLs
    url: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    author: {
      type: UserType,
      args: {
        author: { type: GraphQLID },
      },
      resolve: async (_, { author }, { db: { Users } }) => await Users.findOne(ObjectId(author)),
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve: async ({ _id }, data, { db: { Comments } }) => {
        const comments = await Comments.find({}).toArray();
        return comments.filter(i => i.parent === _id.toString());
      },
    },
    score: { type: GraphQLInt },
  }),
});

export default LinkType;
