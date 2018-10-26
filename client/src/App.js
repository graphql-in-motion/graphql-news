import React from 'react';
import { Route } from 'react-router-dom';

import RecentLinks from './screens/recent';

const App = () => (
  <div className="app-container">
    <Route exact path="/" component={RecentLinks} />
  </div>
);

export default App;
