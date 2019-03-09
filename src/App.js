import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import AllLinks from './screens/all';
import LinkScreen from './screens/link';
import Login from './screens/login';
import SearchScreen from './screens/search';

const App = ({ client }) => (
  <div className="app-container">
    <Route exact path="/" component={AllLinks} />
    <Route path="/link/:id" component={LinkScreen} />
    <Route path="/search/" component={SearchScreen} />
    <Route exact path="/login" component={Login} client={client} />
  </div>
);

App.propTypes = {
  client: PropTypes.object,
};

export default App;
