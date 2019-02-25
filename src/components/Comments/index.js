import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import moment from 'moment';
import gql from 'graphql-tag';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

library.add(faComment);

const GET_COMMENTS_FOR_LINK = gql`
  query CommentsForLink($link: ID!) {
    commentsForLink(_id: $link) {
      ...RecursiveComments
    }
  }

  fragment RecursiveComments on Comment {
    ...CommentFields
    comments {
      ...CommentFields
      comments {
        ...CommentFields
        comments {
          ...CommentFields
          comments {
            ...CommentFields
            comments {
              ...CommentFields
              comments {
                ...CommentFields
                comments {
                  ...CommentFields
                }
              }
            }
          }
        }
      }
    }
  }

  fragment CommentFields on Comment {
    _id
    content
    created_at
    author {
      _id
      username
    }
  }
`;

const CommentsContainer = ({ commentsLength, linkId }) => (
  <Query query={GET_COMMENTS_FOR_LINK} variables={{ link: linkId }}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;

      const { commentsForLink } = data;

      if (commentsForLink.length > 0) {
        return (
          <div className="comment-display-wrapper">
            <div className="comment-display-header">
              <h2>{commentsLength} Comments</h2>
            </div>
            <ul className="comments-list">
              {commentsForLink.map(comment => (
                <React.Fragment key={comment._id}>
                  <CommentStruct comment={comment} />
                  {comment.comments.length > 0
                    ? comment.comments.map(nestedComment => (
                        <NestedCommentStruct
                          key={nestedComment._id}
                          comment={nestedComment}
                          level={1}
                        />
                      ))
                    : null}
                </React.Fragment>
              ))}
            </ul>
          </div>
        );
      }

      return null;
    }}
  </Query>
);

CommentsContainer.propTypes = {
  commentsLength: PropTypes.number.isRequired,
  linkId: PropTypes.string.isRequired,
};

const CommentStruct = ({ comment }) => (
  <li className="comment">
    <div className="comment-meta">
      <span>
        by <span className="username">{comment.author.username}</span>
      </span>
      <span className="comment-timestamp">
        {moment(comment.created_at, '{YYYY} MM-DDTHH:mm:ss SSS [Z] A').fromNow()}
      </span>
    </div>
    <p className="comment-content">{comment.content}</p>
    <div className="comment-action-area">
      <ul className="comment-actions">
        <li>
          <FontAwesomeIcon className="fa-icon" icon="comment" />
          Reply
        </li>
      </ul>
    </div>
  </li>
);

CommentStruct.propTypes = {
  comment: PropTypes.object.isRequired,
};

const NestedCommentStruct = ({ comment, level }) => (
  <div style={{ borderLeft: '2px solid #DFE0E5' }}>
    <div style={{ paddingLeft: '14px' }}>
      <CommentStruct comment={comment} />
    </div>
    <div
      style={{
        borderLeft: '2px solid #DFE0E5',
        paddingLeft: '14px',
        marginLeft: `${level * 14}px`,
      }}
    >
      {comment.comments.length > 0
        ? comment.comments.map(nestedComment => (
            <CommentStruct key={nestedComment._id} comment={nestedComment} />
          ))
        : null}
    </div>
  </div>
);

NestedCommentStruct.propTypes = {
  comment: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
};

export default CommentsContainer;
