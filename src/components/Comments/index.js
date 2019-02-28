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
    const { isFormActive } = this.state;
    const { comment, history, linkId } = this.props;

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

export default class CommentsContainer extends React.Component {
  static propTypes = {
    commentsLength: PropTypes.number.isRequired,
    linkId: PropTypes.string.isRequired,
  };

  renderComments(comments) {
    const commentsForDisplay = comments.map(comment => {
      const commentStruct = <CommentStruct {...this.props} comment={comment} />;

      let nestedComment;

      if (comment.comments && comment.comments.length > 0) {
        nestedComment = this.renderComments(comment.comments);
      }

      return (
        <React.Fragment key={comment._id}>
          {commentStruct}
          {nestedComment}
        </React.Fragment>
      );
    });

    return <ul className="comments-list">{commentsForDisplay}</ul>;
  }

  render() {
    return (
      <Query
        query={GET_COMMENTS_FOR_LINK}
        variables={{ link: this.props.linkId }}
        pollInterval={500}
      >
        {({ data }) => {
          const { commentsForLink } = data;

          if (commentsForLink && commentsForLink.length > 0) {
            return (
              <div className="comment-display-wrapper">
                <div className="comment-display-header">
                  <h2>{this.props.commentsLength} Comments</h2>
                </div>
                {this.renderComments(commentsForLink)}
              </div>
            );
          }

          return null;
        }}
      </Query>
    );
  }
}
