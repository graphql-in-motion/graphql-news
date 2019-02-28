import React from 'react';
import PropTypes from 'prop-types';

import ScoreHOC from './Score';
import Meta from './Meta';

const Link = ({ _id, author, authorId, url, description, commentsLength, createdAt, score }) => (
  <div className="link-wrapper">
    <ScoreHOC _id={_id} score={score} />
    <div
      className="link-content-wrapper"
      style={{ display: 'inline-flex', flexDirection: 'column' }}
    >
      <div className="link-title-wrapper">
        <a className="link-title" href={url}>
          {description.length > 60 ? `${description.substring(0, 60)}...` : description}
        </a>
        <a className="link-portal" href={url}>
          ({url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]})
        </a>
      </div>
      <Meta
        _id={_id}
        author={author}
        authorId={authorId}
        commentsLength={commentsLength}
        createdAt={createdAt}
      />
    </div>
  </div>
);

Link.propTypes = {
  _id: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  authorId: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  commentsLength: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
};

export default Link;
