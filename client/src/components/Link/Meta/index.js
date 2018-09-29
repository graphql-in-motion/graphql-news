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
      by <a href="#">{author}</a> 3 hours ago
    </span>
    <span style={{ margin: '0 0.25em' }}>|</span>
    <span>
      <a href="#">hide</a>
    </span>
    <span style={{ margin: '0 0.25em' }}>|</span>
    <span>
      <a href="#">{commentsLength} comments</a>
    </span>
  </Wrapper>
);

Meta.propTypes = {
  author: PropTypes.string.isRequired,
  commentsLength: PropTypes.number.isRequired,
};

export default Meta;
