import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import Modal from '../';

library.add(faTrash);

const ConfirmationModal = () => (
  <Modal headerText="Are you absolutely sure?">
    <p>This action <strong>cannot</strong> be undone.</p>
    <div className="button-group">
      <button className="modal-action-button cancel">Cancel</button>
      <button className="modal-action-button destroy"><FontAwesomeIcon className="button-icon" icon="trash" />Delete</button>
    </div>
  </Modal>
);

export default ConfirmationModal;
