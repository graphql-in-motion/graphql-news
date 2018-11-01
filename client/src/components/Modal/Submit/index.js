import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../';
import SubmitForm from '../../Forms/Submit';

const SubmitModal = ({ dismissModal }) => (
  <Modal headerText="Submit a new link" dismissModal={dismissModal}>
    <SubmitForm />
  </Modal>
);

SubmitModal.propTypes = {
  dismissModal: PropTypes.func.isRequired,
};

export default SubmitModal;
