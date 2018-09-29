import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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
