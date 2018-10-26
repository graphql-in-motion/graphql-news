import { GraphQLID, GraphQLObjectType, GraphQLNonNull } from 'graphql';
import { PubSub } from 'graphql-subscriptions';

import LinkType from './types/link';

const pubsub = new PubSub();

const SubscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: () => ({
    linkVoted: {
      type: LinkType,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
      },
      subscribe: () => pubsub.asyncIterator('linkVoted'),
    },
  }),
});

export default SubscriptionType;
