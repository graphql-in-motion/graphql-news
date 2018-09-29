import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withApollo } from 'react-apollo';

const Count = styled.span`
  font-weight: bold;
  color: #ff6600;
  margin: 0.2em 0;
`;

const ScoreCount = ({ score }) => <Count>{score}</Count>;

ScoreCount.propTypes = {
  score: PropTypes.number.isRequired,
};

export default withApollo(ScoreCount);
