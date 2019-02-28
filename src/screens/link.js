import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Header from '../components/Header';
import Link from '../components/Link';
import CommentForm from '../components/Forms/Comment';
import CommentsContainer from '../components/Comments';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

const GET_LINK = gql`
  query GetLink($link: ID!) {
    link(_id: $link) {
      _id
      author {
        _id
        username
      }
      commentsLength
      created_at
      description
      score
      url
    }
  }
`;

const LinkScreen = ({ history }) => {
  const qs = window.location.pathname; // eslint-disable-line no-undef

  return (
    <div className="screen-wrapper flex-direction-column">
      <Header history={history} />
      <Query query={GET_LINK} variables={{ link: qs.replace(/\/link\//, '') }}>
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;
          if (error) return <ErrorMessage error={error.toString()} />;

          const {
            _id,
            author: { username },
            commentsLength,
            created_at, // eslint-disable-line camelcase
            description,
            score,
            url,
          } = data.link;

          return (
            <React.Fragment>
              <div className="link-screen-wrapper">
                <Link
                  _id={_id}
                  author={username}
                  authorId={data.link.author._id}
                  commentsLength={commentsLength}
                  createdAt={created_at} // eslint-disable-line camelcase
                  description={description}
                  score={score}
                  url={url}
                />
                <CommentForm history={history} linkId={_id} />
              </div>
              <CommentsContainer commentsLength={commentsLength} history={history} linkId={_id} />
            </React.Fragment>
          );
        }}
      </Query>
    </div>
  );
};

LinkScreen.propTypes = {
  history: PropTypes.object.isRequired,
};

export default LinkScreen;
