import React from 'react';
import { Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faEllipsisH } from '@fortawesome/free-solid-svg-icons'

import Tower from '../Svg/tower';
import { AUTH_TOKEN } from '../../constants';

library.add(faSearch, faEllipsisH);

const Header = ({ history }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  return (
    <div className="header-wrapper">
      <header className="header">
        <nav className="flex header-content">
          <div className="inline-flex">
            <Link to="/">
              <Tower />
            </Link>
            <ul className="header-nav inline-flex align-items-center" role="navigation">
              <li>Top</li>
              <li>Recent</li>
              <li>Comments</li>
              {/* <li><FontAwesomeIcon icon="ellipsis-h" /></li> */}
            </ul>
          </div>
          <div className="login-context-wrapper inline-flex align-items-center">
            {authToken ? (
              <button
                className="logout-button"
                onClick={() => {
                  localStorage.removeItem(AUTH_TOKEN)
                  history.push(`/`)
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
    </div>
  );
};

export default Header;
