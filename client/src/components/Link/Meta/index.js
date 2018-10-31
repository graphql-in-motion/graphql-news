/* eslint-disable no-script-url */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const DELETE_LINK_MUTATION = gql`
  mutation DeleteLink($_id: ID!) {
    removed: destroyLink(id: $_id) {
      _id
    }
  }
`;

const Meta = ({ _id, author, commentsLength }) => (
  <div className="meta-wrapper">
    <span>
      by <a href="javascript:void(0);">{author}</a> 3 hours ago
    </span>
    <span style={{ margin: '0 0.25em' }}>|</span>
    <span>
      <a href="javascript:void(0);">hide</a>
    </span>
    <span style={{ margin: '0 0.25em' }}>|</span>
    <span>
      <Link to={`/link/${_id}`}>{commentsLength} comment{commentsLength !== 1 ? 's' : ''}</Link>
    </span>
    <span style={{ margin: '0 0.25em' }}>|</span>
    <Mutation
      mutation={DELETE_LINK_MUTATION}
      variables={{ _id }}
      onCompleted={data => console.log(data)}
     >
      {mutate => (
        <button className="admin-delete-button" onClick={mutate}>
          delete
        </button>
      )}
    </Mutation>
  </div>
);

Meta.propTypes = {
  author: PropTypes.string.isRequired,
  commentsLength: PropTypes.number.isRequired,
  id: PropTypes.string,
};

export default Meta;
