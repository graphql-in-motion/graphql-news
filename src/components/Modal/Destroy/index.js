import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import gql from 'graphql-tag';

import Modal from '..';

library.add(faTrash);

const DESTROY_LINK_MUTATION = gql`
  mutation DeleteLink($id: ID!) {
    removed: destroyLink(id: $id) {
      _id
    }
  }
`;

const DestroyModal = ({ id, dismissModal, isActive }) => (
  <Modal headerText="Are you absolutely sure?" dismissModal={dismissModal} isActive={isActive}>
    <div className="warning">
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <p>Unexpected bad things will happen if you don't read this!</p>
    </div>
    <p className="modal-text">
      The link, its score, and its comments will be removed. This action <strong>cannot</strong> be
      undone.
    </p>
    <div className="button-group">
      <button className="modal-action-button cancel" onClick={dismissModal}>
        Cancel
      </button>
      <Mutation
        mutation={DESTROY_LINK_MUTATION}
        variables={{ id }}
        onCompleted={() => window.location.reload(true)} // eslint-disable-line no-undef
      >
        {mutate => (
          <button className="modal-action-button destroy" onClick={mutate}>
            <FontAwesomeIcon className="fa-icon" icon="trash" />
            Delete
          </button>
        )}
      </Mutation>
    </div>
  </Modal>
);

DestroyModal.propTypes = {
  id: PropTypes.string.isRequired,
  dismissModal: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
};

export default DestroyModal;
