import React from 'react';
import styled from 'styled-components'; // eslint-disable-line
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Link from './components/Link';

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    border-bottom: 1px solid black;

    &:last-child {
      border-bottom: 0;
    }
  }
`;

const App = ({ data: { allLinks } }) => (
  <AppContainer>
    <LinkList>
      {allLinks
        ? allLinks.map(link => (
            <li>
              <Link
                author={link.author ? link.author : 'anonymous'}
                url={link.url}
                description={link.description}
                comments={link.comments.length}
                score={link.score}
              />
            </li>
          ))
        : null}
    </LinkList>
  </AppContainer>
);

export default graphql(gql`
  query AllLinksForHomepage {
    allLinks(first: 8, skip: 0) {
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
