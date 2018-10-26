import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { AUTH_TOKEN } from '../constants';

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, provider: { email: $email, password: $password }) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    signInUser(email: $email, password: $password) {
      token
    }
  }
`;

class LoginForm extends Component {
  state = {
    login: true,
    email: '',
    password: '',
    username: '',
  };

  _confirmLogin = async data => {
    const { token } = this.state.login ? data.signInUser : data.createUser;
    this._saveUserData(token);
    this.props.history.push(`/`);
  }

  _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token);
  }

  render() {
    const {
      login,
      email,
      password,
      username,
    } = this.state;

    return (
      <div className="squeeze-form-wrapper">
        <div>
          <h4 className="page-title">{login ? 'Login' : 'Sign Up'}</h4>
          {!login && (
            <input
              value={username}
              onChange={e => this.setState({ username: e.target.value })}
              type="text"
              placeholer="Username"
            />
          )}
          <input
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholer="Email Address"
          />
          <input
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Password"
          />
        </div>
        <div>
          <Mutation
            mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
            variables={{ username, email, password }}
            onCompleted={data => this._confirmLogin(data)}
          >
            {mutation => (
            <button
              className="login-hero-button"
              onClick={mutation}
            >
              {login ? 'Login' : 'Sign Up'}
            </button>
            )}
          </Mutation>
          <button
            className="pointer button"
            onClick={() => this.setState({ login: !login })}
          >
            {login
              ? 'Need to create an account?'
              : 'Already have an account?'}
          </button>
        </div>
      </div>
    );
  }
};

export default LoginForm;