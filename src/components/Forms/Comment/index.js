import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const SUBMIT_COMMENT_MUTATION = gql`
  mutation CreateTopLevelComment($link: ID!, $content: String!) {
    createComment(link: $link, content: $content) {
      author {
        _id
      }
      comments {
        _id
      }
      content
      created_at
      link {
        _id
      }
      parent {
        _id
      }
    }
  }
`;

export default class CommentForm extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    linkId: PropTypes.string.isRequired,
  };

  state = {
    comment: '',
  };

  render() {
    const { comment } = this.state;
    const { linkId } = this.props;

    return (
      <div className="comment-form-wrapper">
        <Mutation
          mutation={SUBMIT_COMMENT_MUTATION}
          variables={{ link: linkId, content: comment }}
          onCompleted={() => window.location.reload(true)} // eslint-disable-line no-undef
          // eslint-disable-next-line no-alert,no-undef
          onError={error => alert(error.toString().replace('Error: GraphQL error: ', ''))}
        >
          {mutate => (
            <form className="comment-form" onSubmit={mutate}>
              <textarea
                placeholder="What are your thoughts?"
                onChange={e => this.setState({ comment: e.target.value })}
                value={comment}
              />
              <input className="comment-button" type="submit" value="Post Comment" />
            </form>
          )}
        </Mutation>
      </div>
    );
  }
}
