/* global window */
import { split } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';

import { AUTH_TOKEN } from './constants';
import { resolvers } from './resolvers';

require('dotenv').config();

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: window.localStorage,
});

const localWebsocketUri = `ws://localhost:${4040}/api/subscriptions`;
const prodWebsocketUri = `wss://${window.location.host}/api/subscriptions`;

// WebSocket endpoint (used for subscriptions)
const wsLink = new WebSocketLink({
  uri: process.env.NODE_ENV === 'production' ? prodWebsocketUri : localWebsocketUri,
  options: {
    reconnect: true,
  },
});

const localHttpUri = `http://localhost:${4000}/api/v1`;
const prodHttpUri = `https://${window.location.host}/api/v1`;

// HTTP endpoint
const httpLink = new HttpLink({
  uri: process.env.NODE_ENV === 'production' ? prodHttpUri : localHttpUri,
});

// Using the `split()` function, we can send data to each link's
// uri depending on what kind of operation is being performed
const protocolLink = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

const authLink = setContext((_, { headers }) => {
  const token = window.localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const link = authLink.concat(protocolLink);

// The Apollo client
export const client = new ApolloClient({
  link,
  cache,
  resolvers,
});

const data = {
  User: {
    __typename: 'User',
    _id: null,
    username: null,
  },
};

cache.writeData({ data });

client.onResetStore(() => cache.writeData({ data }));
