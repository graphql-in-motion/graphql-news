import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import gql from 'graphql-tag';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { client } from '../../root';

import Tower from '../Svg/tower';
import { AUTH_TOKEN } from '../../constants';
import SubmitModal from '../Modal/Submit';

library.add(faSearch);

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submit: false,
      user: null,
      token: localStorage.getItem(AUTH_TOKEN), // eslint-disable-line no-undef
      search: '',
    };

    this.dismissModal = this.dismissModal.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  static propTypes = {
    history: PropTypes.object,
  };

  componentDidMount() {
    this.getUserData();
  }

  dismissModal() {
    this.setState({
      submit: false,
    });
  }

  async getUserData() {
    if (this.state.token) {
      const {
        data: { user },
      } = await client.query({
        query: gql`
          query GetUser {
            user {
              _id
              username
              links {
                _id
              }
            }
          }
        `,
      });

      this.setState({ user });
    }
  }

  handleSearchChange(e) {
    this.setState({ search: e.target.value });
  }

  handleSearchSubmit(e) {
    e.preventDefault();

    this.props.history.push({
      pathname: '/search',
      search: `?query=${this.state.search}`,
    });
  }

  render() {
    const { submit, user, token } = this.state;

    return (
      <div className="header-wrapper">
        <header className="header">
          <nav className="flex header-content">
            <div className="inline-flex">
              <Link to="/">
                <Tower />
              </Link>
              <ul className="header-nav inline-flex align-items-center" role="navigation">
                {token && (
                  <li>
                    <span onClick={() => this.setState({ submit: !this.state.submit })}>
                      Submit
                    </span>
                  </li>
                )}
              </ul>
            </div>
            <div className="login-context-wrapper inline-flex align-items-center">
              {token && user ? (
                <div>
                  <p className="current-user">{user.username}</p>
                  <button
                    className="logout-button"
                    onClick={() => {
                      localStorage.removeItem(AUTH_TOKEN); // eslint-disable-line no-undef
                      client.clearStore();
                      this.props.history.push(`/`);
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="ml1 no-underline black">
                  <button className="login-button">Login</button>
                </Link>
              )}

              <form className="search-wrapper" onSubmit={this.handleSearchSubmit}>
                <FontAwesomeIcon className="search-icon" icon="search" />
                <input
                  type="text"
                  className="search-text"
                  value={this.state.search}
                  onChange={this.handleSearchChange}
                  placeholder="Search"
                />
              </form>
            </div>
          </nav>
        </header>
        {submit ? (
          <SubmitModal dismissModal={this.dismissModal} history={this.props.history} />
        ) : null}
      </div>
    );
  }
}

export default Header;
