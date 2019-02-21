import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Header from '../components/Header';
import Feed from '../components/Feed';

const TOP_LINKS_QUERY = gql`
  query TopLinksQuery {
    links: filterLinks(filter: { top: 5 }) {
      _id
      url
      description
      score
      comments {
        _id
      }
    }
  }
`;

const TopLinks = ({ data: { links }, history }) => (
  <div className="screen-wrapper flex-direction-column">
    <Header history={history} />
    <Feed links={links} />
  </div>
);

TopLinks.propTypes = {
  data: PropTypes.object.isRequired,
};

export default graphql(TOP_LINKS_QUERY)(TopLinks);