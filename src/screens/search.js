import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Header from '../components/Header';
import Feed from '../components/Feed';

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
        <p>Links matching {`"${search}"`}</p>
      </div>
      <Query query={LINK_SEARCH} variables={{ qs: search }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;
          const { links } = data;

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
