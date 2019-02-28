import React from 'react';
import PropTypes from 'prop-types';

import Link from '../Link';

const Feed = ({ links }) => (
  <div className="feed-wrapper">
    <div className="link-list">
      {links
        ? links.map((link, i) => (
            <li key={i}>
              <Link
                _id={link._id}
                author={link.author.username}
                authorId={link.author._id}
                url={link.url}
                description={link.description}
                commentsLength={link.commentsLength}
                score={link.score}
                createdAt={link.created_at}
              />
            </li>
          ))
        : null}
    </div>
  </div>
);

Feed.propTypes = {
  links: PropTypes.array.isRequired,
};

export default Feed;
