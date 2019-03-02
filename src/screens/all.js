import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Banner from '../components/Banner';
import Header from '../components/Header';
import Feed from '../components/Feed';
import PaginationBar from '../components/Pagination';
import Spinner from '../components/Spinner';

const GET_LINKS = gql`
  query RecentLinks($skip: Int) {
    links(first: 10, skip: $skip, filter: { recent: true }) {
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
    skip = parseInt(page, 10) * 10 - 10;
  } else {
    skip = 0;
  }

  return (
    <div className="screen-wrapper flex-direction-column">
      <Banner />
      <Header history={props.history} />
      <Query query={GET_LINKS} variables={{ skip }}>
        {({ loading, data }) => {
          if (loading) return <Spinner />;
          if (data) {
            const { links } = data;
            let currentPage = parseInt(page, 10);
            if (!currentPage) {
              currentPage = 0;
            }

            return (
              <React.Fragment>
                <PaginationBar currentPage={currentPage} linkCount={links.length} />
                <Feed links={links} />
              </React.Fragment>
            );
          }

          return <Spinner />;
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
