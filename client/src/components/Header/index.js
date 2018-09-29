import React from 'react';
import styled from 'styled-components';
// Relative imports
import Tower from '../Svg/tower';

const Wrapper = styled.div`
  display: flex !important;
  justify-content: center;
  background-color: #de1797;
  // box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
  display: block;
  padding: 0.75em 0;
  width: 100%;
`;

const Content = styled.div`
  width: 800px;
`;

const Header = () => (
  <Wrapper>
    <Content>
      <Tower />
    </Content>
  </Wrapper>
);

export default Header;
