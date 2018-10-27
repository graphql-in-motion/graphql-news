import React from 'react';
import PropTypes from 'prop-types';

import ScoreHOC from './Score';
import Meta from './Meta';

const Link = ({ _id, author, url, description, commentsLength, score }) => (
  <div className="link-wrapper">
    <ScoreHOC _id={_id} score={score} />
    <div className="link-title-wrapper" style={{ display: 'inline-flex', flexDirection: 'column' }}>
      <div>
        <a className="link-title" href={url}>{description}</a>
        <a className="link-portal" href={url}>({url.replace(/(^\w+:|^)\/\//, '')})</a>
      </div>
      <Meta _id={_id} author={author} commentsLength={commentsLength} />
    </div>
  </div>
);

Link.propTypes = {
  _id: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  commentsLength: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
};

export default Link;
