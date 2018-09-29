import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Link from './components/Link';

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: #dcdede;
  height: 100%;

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 14px;
`;

const Feed = styled.div`
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  display: table;
  overflow: auto;
  margin-top: 1em;
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
