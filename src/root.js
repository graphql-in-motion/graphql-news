/* global window,localStorage */
import React, { Component } from 'react';
import { split } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';

import { AUTH_TOKEN } from './constants';
import { resolvers } from './resolvers';
import App from './App';

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: window.localStorage,
});

// WebSocket endpoint (used for subscriptions)
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4040/subscriptions`,
  options: {
    reconnect: true,
  },
});

// HTTP endpoint
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/v1',
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
  const token = localStorage.getItem(AUTH_TOKEN);
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
  fetchOptions: {
    mode: 'no-cors',
  },
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

export default class Root extends Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <BrowserRouter>
        <ApolloProvider client={client} className="apollo-provider">
          <App />
        </ApolloProvider>
      </BrowserRouter>
    );
  }
}
