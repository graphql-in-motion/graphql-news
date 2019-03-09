import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';

import { client } from './client';
import App from './App';

const Root = () => (
  <BrowserRouter>
    <ApolloProvider client={client} className="apollo-provider">
      <App />
    </ApolloProvider>
  </BrowserRouter>
);

export default Root;
