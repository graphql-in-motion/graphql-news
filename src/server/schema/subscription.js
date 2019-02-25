import { GraphQLID, GraphQLObjectType, GraphQLNonNull } from 'graphql';

import LinkType from './types/link';
import CommentType from './types/comment';
import { LINK_VOTED, COMMENT_CREATED, pubsub } from '../constants';

const SubscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: () => ({
    vote: {
      type: LinkType,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
      },
      subscribe: () => pubsub.asyncIterator(LINK_VOTED),
    },
    commentCreated: {
      type: CommentType,
      subscribe: () => pubsub.asyncIterator(COMMENT_CREATED),
    },
  }),
});

export default SubscriptionType;
