import { GraphQLID, GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';

import CommentType from './comment';
import LinkType from './link';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    about: { type: GraphQLString },
    comments: {
      type: new GraphQLList(CommentType),
      resolve: async ({ _id }, data, { db: { Comments } }) =>
        await Comments.find({ author: _id }).toArray(),
    },
    created_at: { type: new GraphQLNonNull(GraphQLString) },
    links: {
      type: new GraphQLList(LinkType),
      resolve: async ({ _id }, data, { db: { Links } }) =>
        await Links.find({ author: _id.toString() }).toArray(),
    },
    saved: { type: new GraphQLList(GraphQLID) },
    username: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export default UserType;
