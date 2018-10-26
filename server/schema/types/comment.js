import { GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { ObjectId } from 'mongodb';

import LinkType from './link';
import UserType from './user';

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    link: {
      // Because of the way the lazy evaluation works on the `fields` object, we can reference the
      // Link type before it is defined
      type: LinkType, // eslint-disable-line no-use-before-define
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
        return comments.filter(i => i.parent === _id.toString());
      },
    },
    author: {
      type: UserType,
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

export default CommentType;
