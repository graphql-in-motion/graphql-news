import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';

const DownvoteButton = ({ _id, client }) => {
  function downvoteLink() {
    return client.mutate({
      mutation: gql`
        mutation DownvoteLink($_id: ID!) {
          downvoteLink(_id: $_id) {
            _id
          }
        }
      `,
      variables: {
        _id,
      },
    });
  }

  return (
    <button className="downvote-button" onClick={downvoteLink}>
      <svg
        aria-label="down-arrow"
        className="downvote-down-arrow"
        height="7"
        id="svg-up-arrow"
        role="img"
        version="1.1"
        viewBox="0 0 11 7"
        width="11"
      >
        <path d="m.202 5.715c-.367.417-.217.755.329.755h9.438c.549 0 .702-.33.338-.742l-4.41-4.985c-.363-.41-.947-.412-1.322.013l-4.373 4.96" />
      </svg>
    </button>
  );
};

DownvoteButton.propTypes = {
  _id: PropTypes.string,
  client: PropTypes.object.isRequired,
};

export default withApollo(DownvoteButton);
