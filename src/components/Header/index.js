import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import gql from 'graphql-tag';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Query } from 'react-apollo';
import { client } from '../../client';

import Tower from '../Svg/tower';
import { AUTH_TOKEN } from '../../constants';
import SubmitModal from '../Modal/Submit';

library.add(faSearch);

const GET_CLIENT_USER = gql`
  query GetUser {
    User @client {
      _id
      username
    }
  }
`;

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submit: false,
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

  dismissModal() {
    this.setState({
      submit: false,
    });
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
    const { submit, token } = this.state;

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
              <Query query={GET_CLIENT_USER}>
                {({ data, loading }) => {
                  if (loading) return null;
                  const { User } = data;

                  if (User) {
                    return (
                      <React.Fragment>
                        {token && User._id && User.username ? (
                          <React.Fragment>
                            <p className="current-user">{User.username}</p>
                          </React.Fragment>
                        ) : null}
                        {token ? (
                          <button
                            className="logout-button"
                            onClick={async () => {
                              localStorage.removeItem(AUTH_TOKEN); // eslint-disable-line no-undef
                              await client.resetStore().then(() => window.location.reload(true)); // eslint-disable-line no-undef
                            }}
                          >
                            Logout
                          </button>
                        ) : (
                          <Link to="/login" className="ml1 no-underline black">
                            <button className="login-button">Login</button>
                          </Link>
                        )}
                      </React.Fragment>
                    );
                  }
                  return null;
                }}
              </Query>

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
