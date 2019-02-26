import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Banner from '../components/Banner';
import Header from '../components/Header';
import Feed from '../components/Feed';
import PaginationButtons from '../components/PaginationButtons';

const GET_LINKS = gql`
  query PaginatedLinks($skip: Int) {
    links(first: 5, skip: $skip, filter: { recent: true }) {
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

const AllLinks = props => {
  const qs = window.location.search; // eslint-disable-line no-undef
  const page = qs.replace(/\?p=/, '');
  let skip;
  if (page.length) {
    skip = parseInt(page, 10) * 5 - 5;
  } else {
    skip = 0;
  }

  return (
    <div className="screen-wrapper flex-direction-column">
      <Banner />
      <Header history={props.history} />
      <Query query={GET_LINKS} variables={{ skip }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;
          const { links } = data;
          let currentPage = parseInt(page, 10);
          if (!currentPage) {
            currentPage = 0;
          }

          return (
            <React.Fragment>
              <Feed links={links} />
              <PaginationButtons currentPage={currentPage} linkCount={links.length} />
            </React.Fragment>
          );
        }}
      </Query>
    </div>
  );
};

const NextButton = ({ disabled }) => (
  <button className={`pagination-button ${disabled ? 'disabled' : ''}`} disabled={disabled}>
    Next
  </button>
);

NextButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
};

const PrevButton = ({ disabled }) => (
  <button className={`pagination-button ${disabled ? 'disabled' : ''}`} disabled={disabled}>
    Prev
  </button>
);

PrevButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
};

AllLinks.propTypes = {
  history: PropTypes.object.isRequired,
};

export default AllLinks;
