import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ScoreHOC from './Score';
import Meta from './Meta';

const Title = styled.a`
  color: #34495e;
  text-decoration: none;
  font-size: 1.2em;
`;

const Url = styled.a`
  font-size: 0.8em;
  color: #848584;
  margin: 0 0 0 0.25em;
  text-decoration: none;
`;

const Link = ({ _id, author, url, description, commentsLength, score }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <ScoreHOC _id={_id} score={score} />
    <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
      <div>
        <Title href="#">{description}</Title>
        <Url href="#">({url.replace(/(^\w+:|^)\/\//, '')})</Url>
      </div>
      <Meta author={author} commentsLength={commentsLength} />
    </div>
  </div>
);

Link.propTypes = {
  _id: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  commentsLength: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
};

export default Link;
