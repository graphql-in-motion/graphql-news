import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
// Relative imports
import Link from './components/Link';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: #eceef1;
  height: 100%;

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 14px;
`;

const Feed = styled.div`
  background-color: #ffffff;
  // box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  display: table;
  overflow: auto;
  margin-top: 2em;
  padding: 0.5em 0;
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 0.75em 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: 0;
    }
  }
`;

const App = ({ data: { allLinks } }) => (
  <AppContainer>
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Header />
      <div style={{ display: 'flex' }}>
        <Feed>
          <LinkList>
            {allLinks
              ? allLinks.map((link, i) => (
                  <li key={i}>
                    <Link
                      _id={link._id}
                      author={link.author ? link.author : 'anonymous'}
                      url={link.url}
                      description={link.description}
                      commentsLength={link.comments.length}
                      score={link.score}
                    />
                  </li>
                ))
              : null}
          </LinkList>
        </Feed>
        <Sidebar />
      </div>
    </div>
  </AppContainer>
);

App.propTypes = {
  data: PropTypes.object.isRequired,
};

export default graphql(gql`
  query AllLinksForHomepage {
    allLinks(first: 10, skip: 0) {
      _id
      url
      description
      score
      comments {
        _id
      }
    }
  }
`)(App);
