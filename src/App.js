import React from 'react';
import { Route } from 'react-router-dom';

import RecentLinks from './screens/recent';
import TopLinks from './screens/top';
import LinkScreen from './screens/link';
import Login from './screens/login';
import { Provider } from 'react-redux'
import { Playground, store } from 'graphql-playground-react';

const PlaygroundContainer = () => (
  <Provider store={store}>
    <Playground endpoint="http://localhost:4000/v1"/>
  </Provider>
);

const App = ({ client }) => (
  <div className="app-container">
    <Route exact path="/" component={RecentLinks} />
    <Route exact path="/top" component={TopLinks} />
    <Route exact path="/recent" compoennt={RecentLinks} />
    <Route path="/link/:id" component={LinkScreen} />
    <Route exact path="/login" component={Login} client={client} />
    <div className="playground-container">
      <Route exaxt path="/playground" component={PlaygroundContainer} />
    </div>
  </div>
);

export default App;
