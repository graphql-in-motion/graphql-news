/* global localStorage */
import React, { Component } from 'react';
import { split, ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { withClientState } from 'apollo-link-state';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';
import { CachePersistor } from 'apollo-cache-persist';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';

import { AUTH_TOKEN } from './constants';
import { initialState, resolvers } from './withData';
import App from './App';

const cache = new InMemoryCache();

const stateLink = withClientState({
  cache,
  defaults: initialState,
  resolvers,
});

// const persistor = new CachePersistor({
//   cache,
//   storage: window.localStorage, // eslint-disable-line no-undef
//   debug: true,
// });

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

const networkLink = authLink.concat(protocolLink);

const link = new ApolloLink.from([stateLink, networkLink]); // eslint-disable-line new-cap

// The Apollo client
export const client = new ApolloClient({
  link,
  cache,
});

export default class Root extends Component {
  state = {
    restored: false,
  };

  componentDidMount() {
    // persistor.restore().then(() => this.setState({ restored: true }));
    this.setState({ restored: true });
  }

  render() {
    if (!this.state.restored) {
      return <div>Loading...</div>;
    }

    return (
      <BrowserRouter>
        <ApolloProvider client={client} className="apollo-provider">
          <App />
        </ApolloProvider>
      </BrowserRouter>
    );
  }
}
