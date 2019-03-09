/* global localStorage */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { client } from '../../../client';

import { AUTH_TOKEN } from '../../../constants';

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, provider: { email: $email, password: $password }) {
      _id
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    signInUser(email: $email, password: $password) {
      token
      user {
        _id
        about
        comments {
          _id
        }
        created_at
        links {
          _id
        }
        username
      }
    }
  }
`;

class LoginForm extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  state = {
    login: true,
    email: '',
    password: '',
    username: '',
  };

  _confirmLogin = async data => {
    const { token, user } = this.state.login ? data.signInUser : data.createUser;
    this._saveUserData(token, user);
    this.props.history.push(`/`);
  };

  _saveUserData = (token, user) => {
    localStorage.setItem(AUTH_TOKEN, token);

    client.mutate({
      mutation: gql`
        mutation StoreUser($user: User!) {
          storeUser(user: $user) @client
        }
      `,
      variables: { user },
    });
  };

  render() {
    const { login, email, password, username } = this.state;

    return (
      <div>
        <div className="login-form-wrapper">
          <div className="login-form-content">
            {!login && (
              <Fragment>
                <label>Username</label>
                <input
                  className="login-form-field"
                  value={username}
                  name="username"
                  onChange={e => this.setState({ username: e.target.value })}
                  type="text"
                />
              </Fragment>
            )}
            <label>{login ? 'Username or email address' : 'Email address'}</label>
            <input
              className="login-form-field"
              value={email}
              name="email"
              onChange={e => this.setState({ email: e.target.value })}
              type="text"
            />
            <label>Password</label>
            <input
              className="login-form-field"
              name="password"
              value={password}
              onChange={e => this.setState({ password: e.target.value })}
              type="password"
            />
            <div className="flex login-form-button-group">
              <Mutation
                mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
                variables={{ username, email, password }}
                onCompleted={data => this._confirmLogin(data)}
                // eslint-disable-next-line no-alert,no-undef
                onError={error => alert(error.toString().replace('Error: GraphQL error: ', ''))}
              >
                {mutate => (
                  <button className="login-hero-button" onClick={mutate}>
                    {login ? 'Sign in' : 'Create an account'}
                  </button>
                )}
              </Mutation>
            </div>
          </div>
        </div>
        <div className="callout-wrapper">
          {login ? (
            <span>
              New to GraphQL News?{' '}
              <span className="sign-up-cta" onClick={() => this.setState({ login: !login })}>
                Create an account
              </span>
              .
            </span>
          ) : (
            <span className="sign-in-cta" onClick={() => this.setState({ login: !login })}>
              Already have an account?
            </span>
          )}
        </div>
      </div>
    );
  }
}

export default LoginForm;
