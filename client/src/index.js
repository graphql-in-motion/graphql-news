import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
// Relative imports
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "./scss/index.scss";
import client from './client';

const Root = () => (
  <BrowserRouter>
    <ApolloProvider client={client} className="apollo-provider">
      <App />
    </ApolloProvider>
  </BrowserRouter>
);

ReactDOM.render(<Root />, document.getElementById("root")); // eslint-disable-line no-undef

registerServiceWorker();
