import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import UpvoteButton from './upvoteButton';
import DownvoteButton from './downvoteButton';
import ScoreCount from './scoreCount';

const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1em 0 0;
`;

const Score = ({ _id, score }) => (
  <Wrapper>
    <UpvoteButton _id={_id} />
    <ScoreCount _id={_id} score={score} />
    <DownvoteButton _id={_id} />
  </Wrapper>
);

Score.propTypes = {
  _id: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  client: PropTypes.object.isRequired,
};

export default Score;
