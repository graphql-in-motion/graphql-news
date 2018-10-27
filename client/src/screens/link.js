import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Query } from 'react-apollo';
import gql from 'graphql-tag';

import Header from '../components/Header';
import Link from '../components/Link';

const GET_LINK = gql`
query GetLinkByID($link: ID!) {
  link(_id: $link) {
    _id
    author {
      _id
    }
    comments {
      _id
    }
    created_at
    description
    score
    url
  }
}
`;


const LinkScreen = ({ history }) => {
  const qs = window.location.pathname;

  return (
    <Query query={GET_LINK} variables={{ link: qs.replace(/\/link\//, '') }}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
        const { link } = data;

        return (
          <div className="screen-wrapper flex-direction-column">
            <Header history={history} />
            <div className="flex link-screen-wrapper">
              <Link
                _id={link._id}
                author={link.author ? link.author : 'anonymous'}
                url={link.url}
                description={link.description}
                commentsLength={link.comments.length}
                score={link.score}
              />
              <div>
                <form className="comment-form">
                  <textarea placeholder="What are your thoughts?" />
                  <input className="comment-button" type="submit" value="Post Comment" />
                </form>
              </div>
            </div>
          </div>
        );
      }}
    </Query>
  );
}

LinkScreen.propTypes = {
  data: PropTypes.object.isRequired,
};

export default LinkScreen;