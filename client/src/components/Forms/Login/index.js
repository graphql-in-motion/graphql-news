import React, { Component } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import client from "../../../client";

import { AUTH_TOKEN } from "../../../constants";

const SIGNUP_MUTATION = gql`
  mutation SignupMutation(
    $username: String!
    $email: String!
    $password: String!
  ) {
    createUser(
      username: $username
      provider: { email: $email, password: $password }
    ) {
      token
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
    history: PropTypes.object.isRequired
  };

  state = {
    login: true,
    email: "",
    password: "",
    username: ""
  };

  _confirmLogin = async data => {
    const { token, user } = this.state.login
      ? data.signInUser
      : data.createUser;
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
      variables: { user }
    });
  };

  render() {
    const { login, email, password, username } = this.state;

    return (
      <div className="login-form-wrapper">
        <div className="login-form-content">
          <h4 className="page-title">{login ? "Login" : "Sign Up"}</h4>
          {!login && (
            <input
              className="login-form-field"
              value={username}
              onChange={e => this.setState({ username: e.target.value })}
              type="text"
              placeholder="Username"
            />
          )}
          <input
            className="login-form-field"
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="Email Address"
          />
          <input
            className="login-form-field"
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Password"
          />
          <div className="flex login-form-button-group">
            <button
              className="pointer-button"
              onClick={() => this.setState({ login: !login })}
            >
              {login
                ? "Need to create an account?"
                : "Already have an account?"}
            </button>
            <Mutation
              mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
              variables={{ username, email, password }}
              onCompleted={data => this._confirmLogin(data)}
            >
              {mutate => (
                <button className="login-hero-button" onClick={mutate}>
                  {login ? "Login" : "Sign Up"}
                </button>
              )}
            </Mutation>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginForm;
