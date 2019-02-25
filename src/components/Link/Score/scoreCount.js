import React from 'react';
import PropTypes from 'prop-types';
import { withApollo, Subscription } from 'react-apollo';
import gql from 'graphql-tag';

const ScoreCount = ({ _id, score }) => (
  <Subscription
    subscription={gql`
      subscription onVote($_id: ID!) {
        vote(_id: $_id) {
          _id
          score
        }
      }
    `}
    variables={{ _id }}
    errorPolicy="ignore"
    // eslint-disable-next-line no-alert,no-undef
    onError={error => alert(error.toString().replace('Error: GraphQL error: ', ''))}
  >
    {({ data }) => {
      if (data) {
        const { vote } = data;

        if (vote && vote._id === _id) {
          return <span className="score-count">{vote.score}</span>;
        }
      }
      return <span className="score-count">{score}</span>;
    }}
  </Subscription>
);

ScoreCount.propTypes = {
  _id: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  client: PropTypes.object.isRequired,
};

export default withApollo(ScoreCount);
