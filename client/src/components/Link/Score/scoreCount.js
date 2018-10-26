import React from 'react';
import PropTypes from 'prop-types';
import { withApollo, Subscription } from 'react-apollo';
import gql from 'graphql-tag';

const ScoreCount = ({ _id, score }) => (
  <Subscription
    subscription={gql`
      subscription onVote($_id: ID!) {
        linkVoted(_id: $_id) {
          _id
          score
        }
      }
    `}
    variables={{ _id }}
  >
    {({ data }) => {
      if (data) {
        const { linkVoted } = data;

        if (linkVoted && linkVoted._id === _id) {
          return <span className="score-count">{linkVoted.score}</span>;
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
