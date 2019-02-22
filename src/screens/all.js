import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

import Banner from '../components/Banner';
import Header from '../components/Header';
import Feed from '../components/Feed';

const GET_LINKS = gql`
  query PaginatedLinks($skip: Int) {
    allLinks(first: 5, skip: $skip) {
      _id
      author {
        _id
        username
      }
      created_at
      comments {
        _id
      }
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
          const { allLinks } = data;
          let currentPage = parseInt(page, 10);
          if (!currentPage) {
            currentPage = 0;
          }

          return (
            <div>
              <Feed links={allLinks} />
              <div className="pagination-button-container flex justify-content-center">
                <button
                  className={`pagination-button ${currentPage > 1 ? '' : 'disabled'}`}
                  disabled={currentPage <= 1}
                >
                  {currentPage > 1 ? <Link to={`/?p=${currentPage - 1}`}>Prev</Link> : 'Prev'}
                </button>
                <button
                  className={`pagination-button ${allLinks.length !== 5 ? 'disabled' : ''}`}
                  disabled={allLinks.length !== 5}
                >
                  {allLinks.length === 5 ? <Link to={`/?p=${currentPage + 1}`}>Next</Link> : 'Next'}
                </button>
              </div>
            </div>
          );
        }}
      </Query>
    </div>
  );
};

AllLinks.propTypes = {
  history: PropTypes.object.isRequired,
};

export default AllLinks;
