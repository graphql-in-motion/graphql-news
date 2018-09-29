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
  font-size: inherit;
  display: inline-block;
  color: #848584;
`;

const DownvoteButton = ({ _id, client }) => {
  function downvoteLink() {
    return client.mutate({
      mutation: gql`
        mutation DownvoteLink($_id: ID!) {
          downvoteLink(_id: $_id) {
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
      <Arrow onClick={downvoteLink}>▼</Arrow>
    </Wrapper>
  );
};

DownvoteButton.propTypes = {
  _id: PropTypes.string,
  client: PropTypes.object.isRequired,
};

export default withApollo(DownvoteButton);
