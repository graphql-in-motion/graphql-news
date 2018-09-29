import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 2em 0 0 2em;
  width: 200px;

  a {
    color: inherit;
  }

  h3 {
    color: #35495d;
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
  }

  hr {
    background-color: #d3d7de;
    border: none;
    height: 1px;
    outline: none;
  }

  p {
    font-size: 14px;
    color: rgba(18, 24, 33, 0.7);
    font-weight: 300;
    line-height: 20px;
  }
`;

const Button = styled.a`
  background-color: #dc2396;
  color: #ffffff !important;
  display: inline-block;
  padding: 13px 16px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  text-align: center;
  text-decoration: none;
  border: none;
  border-radius: 3px;
  margin-top: 1em;
`;

const Sidebar = () => (
  <Wrapper>
    {/* <h3>Are you interested in building modern, scalable APIs with GraphQL?</h3> */}
    <p>
      <a
        href="https://www.manning.com/livevideo/graphql-in-motion"
        target="_blank"
        rel="noopener noreferrer"
      >
        GraphQL in Motion
      </a>{' '}
      teaches you to use GraphQL to build easy-to-manage APIs that radically simplify communication
      between the components and services that make up a web application.
    </p>
    <Button
      href="https://www.manning.com/livevideo/graphql-in-motion"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn More
    </Button>
  </Wrapper>
);

export default Sidebar;
