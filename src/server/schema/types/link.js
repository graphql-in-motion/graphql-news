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

const LinkType = new GraphQLObjectType({
  name: 'Link',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    author: {
      type: UserType,
      args: {
        author: { type: GraphQLID },
      },
      resolve: async ({ author }, data, { db: { Users } }) =>
        await Users.findOne({ _id: ObjectId(author) }),
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve: async ({ _id }, data, { db: { Comments } }) => {
        const comments = await Comments.find({ link: ObjectId(_id) }).toArray();
        // Any comment that has a populated `parent` attribute is a nested comment and should
        // not be returned as a top-level comment
        return comments.filter(i => i.parent === null);
      },
    },
    commentsLength: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async ({ _id }, data, { db: { Comments } }) => {
        const comments = await Comments.find({ link: ObjectId(_id) }).toArray();

        if (comments.length > 0) {
          return comments.length;
        }

        return 0;
      },
    },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    score: { type: GraphQLInt },
    url: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export default LinkType;
