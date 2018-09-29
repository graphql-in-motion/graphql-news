/* eslint-disable no-script-url */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  margin-top: 0.25em;
  color: #848584;

  a {
    color: inherit;

    &:hover {
      color: #ff6600;
    }
  }
`;

const Meta = ({ author, commentsLength }) => (
  <Wrapper>
    <span>
      by <a href="javascript:void(0);">{author}</a> 3 hours ago
    </span>
    <span style={{ margin: '0 0.25em' }}>|</span>
    <span>
      <a href="javascript:void(0);">hide</a>
    </span>
    <span style={{ margin: '0 0.25em' }}>|</span>
    <span>
      <a href="javascript:void(0);">{commentsLength} comments</a>
    </span>
  </Wrapper>
);

Meta.propTypes = {
  author: PropTypes.string.isRequired,
  commentsLength: PropTypes.number.isRequired,
};

export default Meta;
