import React from 'react';
import { Route } from 'react-router-dom';

import RecentLinks from './screens/recent';
import TopLinks from './screens/top';
import Login from './screens/login';

const App = () => (
  <div className="app-container">
    <Route exact path="/" component={RecentLinks} />
    <Route exact path="/top" component={TopLinks} />
    <Route exact path="/login" component={Login} />
  </div>
);

export default App;
