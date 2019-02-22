import React from 'react';
import PropTypes from 'prop-types';

import Header from '../components/Header';
import LoginForm from '../components/Forms/Login';

const Login = ({ history }) => (
  <div className="screen-wrapper flex-direction-column">
    <Header history={history} />
    <LoginForm history={history} />
  </div>
);

Login.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Login;
