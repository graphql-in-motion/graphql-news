import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faSadTear } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Feed from '../components/Feed';
import Spinner from '../components/Spinner';

library.add(faLink, faSadTear);

const LINK_SEARCH = gql`
  query GetLinkByID($qs: String!) {
    links(filter: { urlContains: $qs }) {
      _id
      author {
        _id
        username
      }
      commentsLength
      created_at
      description
      score
      url
    }
  }
`;

const SearchScreen = ({ history }) => {
  const search = window.location.search.replace(/\?query=/, ''); // eslint-disable-line no-undef

  return (
    <div className="screen-wrapper flex-direction-column">
      <Header history={history} />
      <div className="searchtext-container">
        <p>
          <FontAwesomeIcon className="search-bar-icon" icon="link" /> Links matching {`"${search}"`}
        </p>
      </div>
      <Query query={LINK_SEARCH} variables={{ qs: search }}>
        {({ loading, data }) => {
          if (loading) return <Spinner />;
          const { links } = data;

          if (links.length === 0) {
            return (
              <div className="search-error-container">
                <FontAwesomeIcon className="frown-icon" icon="sad-tear" />
                Sorry, no links could be found that matched your search. Please try again.
              </div>
            );
          }

          return <Feed links={links} />;
        }}
      </Query>
    </div>
  );
};

SearchScreen.propTypes = {
  history: PropTypes.object.isRequired,
};

export default SearchScreen;
