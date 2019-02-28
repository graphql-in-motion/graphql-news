import React from 'react';
import PropTypes from 'prop-types';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadTear } from '@fortawesome/free-solid-svg-icons';

library.add(faSadTear);

const ErrorMessage = ({ error }) => (
  <div className="search-error-container">
    <FontAwesomeIcon className="frown-icon" icon="sad-tear" />
    {`${error}. Please try again.`}
  </div>
);

ErrorMessage.propTypes = {
  error: PropTypes.string.isRequired,
};

export default ErrorMessage;
