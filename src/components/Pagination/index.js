import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const GET_ALL_LINKS = gql`
  query AllLinks {
    allLinks {
      _id
    }
  }
`;

const PaginationBar = ({ currentPage, linkCount }) => (
  <Query query={GET_ALL_LINKS}>
    {({ loading, data }) => {
      if (loading) return null;

      const linksLength = data.allLinks.length;
      const pageLength = Math.ceil(linksLength / 10);

      return (
        <React.Fragment>
          {linksLength > 10 ? (
            <div className="pagination-bar">
              <div className="pagination-button-container flex justify-content-center align-items-center">
                {currentPage >= 2 ? (
                  <Link to={currentPage > 2 ? `/?p=${currentPage - 1}` : '/'}>
                    <PrevButton disabled={false} />
                  </Link>
                ) : (
                  <PrevButton disabled={true} />
                )}

                {currentPage < 1 ? 1 : currentPage}
                {'/'}
                {pageLength}

                {linkCount >= 10 ? (
                  <Link to={`/?p=${currentPage === 0 ? 2 : currentPage + 1}`}>
                    <NextButton disabled={false} />
                  </Link>
                ) : (
                  <NextButton disabled={true} />
                )}
              </div>
            </div>
          ) : null}
        </React.Fragment>
      );
    }}
  </Query>
);

PaginationBar.propTypes = {
  currentPage: PropTypes.number.isRequired,
  linkCount: PropTypes.number.isRequired,
};

const NextButton = ({ disabled }) => (
  <button className={`pagination-button ${disabled ? 'disabled' : ''}`} disabled={disabled}>
    {`more >`}
  </button>
);

NextButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
};

const PrevButton = ({ disabled }) => (
  <button className={`pagination-button ${disabled ? 'disabled' : ''}`} disabled={disabled}>
    {`< prev`}
  </button>
);

PrevButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
};

export default PaginationBar;
