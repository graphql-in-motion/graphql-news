import React from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import gql from "graphql-tag";

import Modal from "../";

library.add(faTrash);

const DESTROY_LINK_MUTATION = gql`
  mutation DeleteLink($id: ID!) {
    removed: destroyLink(id: $id) {
      _id
    }
  }
`;

const DestroyModal = ({ id, dismissModal }) => (
  <Modal headerText="Are you absolutely sure?" dismissModal={dismissModal}>
    <p>
      This action <strong>cannot</strong> be undone.
    </p>
    <div className="button-group">
      <button className="modal-action-button cancel" onClick={dismissModal}>
        Cancel
      </button>
      <Mutation
        mutation={DESTROY_LINK_MUTATION}
        variables={{ id }}
        onCompleted={data => console.log(data)}
      >
        {mutate => (
          <button className="modal-action-button destroy" onClick={mutate}>
            <FontAwesomeIcon className="button-icon" icon="trash" />Delete
          </button>
        )}
      </Mutation>
    </div>
  </Modal>
);

DestroyModal.propTypes = {
  id: PropTypes.string.isRequired,
  dismissModal: PropTypes.func.isRequired
};

export default DestroyModal;
