import React from 'react';
import ReactDOM from 'react-dom';
import { split } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { getMainDefinition } from 'apollo-utilities';
// Relative imports
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './reset.css';

// WebSocket endpoint (used for subscriptions)
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4040/subscriptions`,
  options: {
    reconnect: true,
  },
});

// HTTP endpoint
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

// Using the `split()` function, we can send data to each link's
// uri depending on what kind of operation is being performed
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

// The Apollo client
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client} style={{ height: '100%', width: '100%' }}>
    <App />
  </ApolloProvider>,
  document.getElementById('root') // eslint-disable-line no-undef
);
registerServiceWorker();
