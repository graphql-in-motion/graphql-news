import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withApollo, Subscription } from 'react-apollo';
import gql from 'graphql-tag';

const Count = styled.span`
  color: #dc2396;
  font-weight: 700;
  margin: 0.2em 0;
  letter-spacing: -0.02em;
  width: 26px;
  text-align: center;
  font-size: 14px;
`;

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
          return <Count>{linkVoted.score}</Count>;
        }
      }
      return <Count>{score}</Count>;
    }}
  </Subscription>
);

ScoreCount.propTypes = {
  _id: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  client: PropTypes.object.isRequired,
};

export default withApollo(ScoreCount);
