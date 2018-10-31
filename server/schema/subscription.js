import { GraphQLID, GraphQLObjectType, GraphQLNonNull } from 'graphql';

import LinkType from './types/link';
import { LINK_VOTED, pubsub } from '../constants';

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
  }),
});

export default SubscriptionType;
