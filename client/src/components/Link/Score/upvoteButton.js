import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import styled from 'styled-components';
import gql from 'graphql-tag';

const Wrapper = styled.div`
  font-size: 0.6em;
  cursor: pointer;
`;

const Arrow = styled.span`
  display: inline-block;
  color: #848584;
`;

const UpvoteButton = ({ _id, client }) => {
  function upvoteLink() {
    return client.mutate({
      mutation: gql`
        mutation UpvoteLink($_id: _id) {
          upvoteLink(_id: $_id) {
            _id
          }
        }
      `,
      variables: {
        _id,
      },
    });
  }

  return (
    <Wrapper>
      <Arrow onClick={upvoteLink}>▲</Arrow>
    </Wrapper>
  );
};

UpvoteButton.propTypes = {
  _id: PropTypes.string,
  client: PropTypes.object.isRequired,
};

export default withApollo(UpvoteButton);
