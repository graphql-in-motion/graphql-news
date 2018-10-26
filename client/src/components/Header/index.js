import React from 'react';
import styled from 'styled-components';
// Relative imports
import Tower from '../Svg/tower';

const Wrapper = styled.div`
  width: 100%;

  .header {
    display: flex;
    justify-content: center;
    background-color: #de1797;
    padding: 1em 0;
    width: 100%;
  }

  .header-wrapper {
    .width: 800px;
  }
`;

const Header = () => (
  <Wrapper>
    <header className="header">
      <div className="header-wrapper">
        <Tower />
      </div>
    </header>
  </Wrapper>
);

export default Header;
