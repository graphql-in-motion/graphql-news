import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const DOWNVOTE_MUTATION = gql`
  mutation DownvoteLink($_id: ID!) {
    downvoteLink(_id: $_id) {
      _id
    }
  }
`;

const DownvoteButton = ({ _id }) => (
  <Mutation
    mutation={DOWNVOTE_MUTATION}
    variables={{ _id }}
    // eslint-disable-next-line no-alert,no-undef
    onError={error => alert(error.toString().replace('Error: GraphQL error: ', ''))}
  >
    {mutate => (
      <button className="downvote-button" onClick={mutate}>
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
    )}
  </Mutation>
);

DownvoteButton.propTypes = {
  _id: PropTypes.string.isRequired,
};

export default DownvoteButton;
