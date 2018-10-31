import React from 'react';
import Modal from '../';

const ConfirmationModal = () => (
  <Modal headerText="Are you absolutely sure?">
    <p>This action <strong>cannot</strong> be undone.</p>
    <div className="button-group">
      <button className="modal-action-button cancel">Cancel</button>
      <button className="modal-action-button destroy">Delete</button>
    </div>
  </Modal>
);

export default ConfirmationModal;
