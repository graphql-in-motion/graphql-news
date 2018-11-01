import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const SUBMIT_COMMENT_MUTATION = gql`
  mutation CreateTopLevelComment($link: ID!, $content: String!) {
    createComment(
      link: $link,
      content: $content
    ) {
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
    id: PropTypes.string.isRequired,
  }

  state = {
    comment: ''
  }

  onSubmit(e, mutate) {
    e.preventDefault();

    mutate();
  }

  render() {
    const { id } = this.props;
    const { comment } = this.state;

    return (
      <div className="comment-form-wrapper">
        <Mutation
          mutation={SUBMIT_COMMENT_MUTATION}
          variables={{ link: id, content: comment }}
          onCompleted={data => console.log(data)}
        >
          {mutate => (
            <form className="comment-form" onSubmit={e => this.onSubmit(e, mutate)}>
              <textarea placeholder="What are your thoughts?" onChange={e => this.setState({ comment: e.target.value})} value={comment} />
              <input
                className="comment-button"
                type="submit"
                value="Post Comment"
              />
            </form>
          )}
        </Mutation>
      </div>
    );
  }
}