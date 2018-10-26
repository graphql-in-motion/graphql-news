import React from 'react';
import PropTypes from 'prop-types';

import UpvoteButton from './upvoteButton';
import DownvoteButton from './downvoteButton';
import ScoreCount from './scoreCount';

const Score = ({ _id, score }) => (
  <div className="score-wrapper">
    <UpvoteButton _id={_id} />
    <ScoreCount _id={_id} score={score} />
    <DownvoteButton _id={_id} />
  </div>
);

Score.propTypes = {
  _id: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};

export default Score;
