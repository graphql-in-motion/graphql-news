import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import CSSTransition from 'react-transition-group/CSSTransition';

import Tower from '../Svg/tower';
import { AUTH_TOKEN } from '../../constants';

library.add(faSearch);

class SubmitForm extends Component {
  state = {
    url: ''
  }

  render() {
    const { url } = this.state;

    return (
      <div className="submit-form-wrapper flex justify-content-center">
        <div className="submit-form-content">
          <form className="inline-flex justify-content-between align-items-center">
            <input type="text" value={url} onChange={e => this.setState({ url: e.target.value })} placeholder="Submit a link" />
            <span type="instructions">Press <code>enter</code> to submit</span>
          </form>
        </div>
      </div>
    );
  }
}

class Header extends Component {
  static propTypes = {
    history: PropTypes.object,
  }

  state = {
    submit: false,
  }

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    const path = window.location.pathname;
    const { submit } = this.state;

    return (
      <div className="header-wrapper">
        <header className="header">
          <nav className="flex header-content">
            <div className="inline-flex">
              <Link to="/">
                <Tower />
              </Link>
              <ul className="header-nav inline-flex align-items-center" role="navigation">
                <li><Link to="/top" className={`nav-link ${path === '/top' ? 'active' : null}`}>Top</Link></li>
                <li><Link to="/recent" className={`nav-link ${path === '/recent' ? 'active' : null}`}>Recent</Link></li>
                <li><Link to="/comments" className={`nav-link ${path === '/comments' ? 'active' : null}`}>Comments</Link></li>
                {authToken && (
                  <li><span onClick={() => this.setState({ submit: !this.state.submit })}>Submit</span></li>
                )}
              </ul>
            </div>
            <div className="login-context-wrapper inline-flex align-items-center">
              {authToken ? (
                <button
                  className="logout-button"
                  onClick={() => {
                    localStorage.removeItem(AUTH_TOKEN)
                    this.props.history.push(`/`)
                  }}
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className="ml1 no-underline black">
                  <button className="login-button">Login</button>
                </Link>
              )}

              <div className="search-wrapper">
                <FontAwesomeIcon className="search-icon" icon="search" />
                <input type="text" className="search-text" value="" placeholder="Search" />
              </div>
            </div>
          </nav>
        </header>
        <CSSTransition
          in={submit}
          timeout={300}
          classNames="submit"
          unmountOnExit
        >
          <SubmitForm />
        </CSSTransition>
      </div>
    );
  }
}

export default Header;
