import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const PaginationButtons = ({ currentPage, linkCount }) => (
  <div className="pagination-button-container flex justify-content-center">
    {currentPage >= 2 ? (
      <Link to={currentPage > 2 ? `/?p=${currentPage - 1}` : '/'}>
        <PrevButton disabled={false} />
      </Link>
    ) : (
      <PrevButton disabled={true} />
    )}

    {linkCount >= 5 ? (
      <Link to={`/?p=${currentPage === 0 ? 2 : currentPage + 1}`}>
        <NextButton disabled={false} />
      </Link>
    ) : (
      <NextButton disabled={true} />
    )}
  </div>
);

PaginationButtons.propTypes = {
  currentPage: PropTypes.number.isRequired,
  linkCount: PropTypes.number.isRequired,
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

export default PaginationButtons;
