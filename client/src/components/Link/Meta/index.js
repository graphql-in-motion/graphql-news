/* eslint-disable no-script-url */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import ConfirmationModal from '../../Modal/Destroy';

const DELETE_LINK_MUTATION = gql`
  mutation DeleteLink($_id: ID!) {
    removed: destroyLink(id: $_id) {
      _id
    }
  }
`;

export default class Meta extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    }

    this.showModal = this.showModal.bind(this);
  }

  static propTypes = {
    author: PropTypes.string.isRequired,
    commentsLength: PropTypes.number.isRequired,
    id: PropTypes.string,
  }

  showModal(action) {
    this.setState({
      showModal: true,
    });
  }

  render() {
    const {
      _id,
      author,
      commentsLength
    } = this.props;

    return (
      <div className="meta-wrapper">
        {this.state.showModal ? <ConfirmationModal /> : null}
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
            <button className="admin-delete-button" onClick={() => this.showModal(mutate)}>
              delete
            </button>
          )}
        </Mutation>
      </div>
    );
  }
}
