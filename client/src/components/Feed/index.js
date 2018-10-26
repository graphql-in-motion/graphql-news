import React from 'react';

import Link from '../Link';

const Feed = ({ links }) => (
  <div className="flex">
    <div className="feed-wrapper">
      <div className="link-list">
        {links
          ? links.map((link, i) => (
              <li key={i}>
                <Link
                  _id={link._id}
                  author={link.author ? link.author : 'anonymous'}
                  url={link.url}
                  description={link.description}
                  commentsLength={link.comments.length}
                  score={link.score}
                />
              </li>
            ))
          : null}
      </div>
    </div>
  </div>
);

export default Feed;