/* eslint-disable no-script-url */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Meta = ({ _id, author, commentsLength }) => (
  <div className="meta-wrapper">
    <span>
      by <a href="javascript:void(0);">{author}</a> 3 hours ago
    </span>
    <span style={{ margin: '0 0.25em' }}>|</span>
    <span>
      <a href="javascript:void(0);">hide</a>
    </span>
    <span style={{ margin: '0 0.25em' }}>|</span>
    <span>
      <Link to={`/link/${_id}`}>{commentsLength} comments</Link>
    </span>
  </div>
);

Meta.propTypes = {
  author: PropTypes.string.isRequired,
  commentsLength: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
};

export default Meta;
