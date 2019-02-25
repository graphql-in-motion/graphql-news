import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import moment from 'moment';
import gql from 'graphql-tag';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

import CommentReplyForm from '../Forms/Comment/ReplyForm';

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

const CommentsContainer = props => (
  <Query query={GET_COMMENTS_FOR_LINK} variables={{ link: props.linkId }}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;

      const { commentsForLink } = data;

      if (commentsForLink.length > 0) {
        return (
          <div className="comment-display-wrapper">
            <div className="comment-display-header">
              <h2>{props.commentsLength} Comments</h2>
            </div>
            <ul className="comments-list">
              {commentsForLink.map(comment => (
                <React.Fragment key={comment._id}>
                  <CommentStruct {...props} comment={comment} linkId={props.linkId} />
                  {comment.comments.length > 0
                    ? comment.comments.map(nestedComment => (
                        <NestedCommentStruct
                          {...props}
                          key={nestedComment._id}
                          linkId={props.linkId}
                          comment={nestedComment}
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

class CommentStruct extends React.Component {
  static propTypes = {
    comment: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    linkId: PropTypes.string.isRequired,
  };

  state = {
    isFormActive: false,
  };

  toggleReplyForm() {
    const { isFormActive } = this.state;

    if (isFormActive) {
      this.setState({ isFormActive: false });
    } else {
      this.setState({ isFormActive: true });
    }
  }

  render() {
    const { comment, history, linkId } = this.props;
    const { isFormActive } = this.state;

    return (
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
            <li onClick={this.toggleReplyForm.bind(this)} className="comment-action">
              <FontAwesomeIcon className="fa-icon" icon="comment" />
              Reply
            </li>
          </ul>
          {isFormActive ? (
            <CommentReplyForm history={history} linkId={linkId} parentComment={comment._id} />
          ) : null}
        </div>
      </li>
    );
  }
}

const NestedCommentStruct = ({ comment, linkId, history }) => (
  <div style={{ borderLeft: '2px solid #DFE0E5' }}>
    <div style={{ paddingLeft: '14px' }}>
      <CommentStruct comment={comment} history={history} linkId={linkId} />
    </div>
    <div
      style={{
        borderLeft: '2px solid #DFE0E5',
        paddingLeft: '14px',
        marginLeft: `14px`,
      }}
    >
      {comment.comments.length > 0
        ? comment.comments.map(nestedComment => (
            <CommentStruct
              comment={nestedComment}
              history={history}
              key={nestedComment._id}
              linkId={linkId}
            />
          ))
        : null}
    </div>
  </div>
);

NestedCommentStruct.propTypes = {
  comment: PropTypes.object.isRequired,
  linkId: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};

export default CommentsContainer;
