import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Playground, store } from 'graphql-playground-react';

import AllLinks from './screens/all';
import LinkScreen from './screens/link';
import Login from './screens/login';
import SearchScreen from './screens/search';

const PlaygroundContainer = () => (
  <Provider store={store}>
    <Playground endpoint="http://localhost:4000/v1" />
  </Provider>
);

const App = ({ client }) => (
  <div className="app-container">
    <Route exact path="/" component={AllLinks} />
    <Route path="/link/:id" component={LinkScreen} />
    <Route path="/search/" component={SearchScreen} />
    <Route exact path="/login" component={Login} client={client} />
    <div className="playground-container">
      <Route exaxt path="/playground" component={PlaygroundContainer} />
    </div>
  </div>
);

App.propTypes = {
  client: PropTypes.object.isRequired,
};

export default App;
