import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();
export const LINK_VOTED = 'vote';
export const COMMENT_CREATED = 'commentCreated';
