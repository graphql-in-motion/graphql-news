import { GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { ObjectId } from 'mongodb';

import LinkType from './link';
import UserType from './user';

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    link: {
      type: LinkType,
      resolve: async ({ link }, data, { db: { Links } }) => await Links.findOne(ObjectId(link)),
    },
    parent: {
      type: CommentType,
      resolve: async ({ parent }, data, { db: { Comments } }) =>
        await Comments.findOne(ObjectId(parent)),
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve: async ({ _id }, data, { db: { Comments } }) => {
        const comments = await Comments.find({}).toArray();
        // eslint-disable-next-line consistent-return,array-callback-return
        return comments.filter(i => {
          if (i.parent) {
            return i.parent.toString() === _id.toString();
          }
        });
      },
    },
    author: {
      type: UserType,
      args: {
        author: { type: GraphQLID },
      },
      resolve: async ({ author }, data, { db: { Users } }) => await Users.findOne(ObjectId(author)),
    },
    content: { type: new GraphQLNonNull(GraphQLString) },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export default CommentType;
