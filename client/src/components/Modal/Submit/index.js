import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../';
import SubmitForm from '../../Forms/Submit';

const SubmitModal = ({ dismissModal, history }) => (
  <Modal headerText="Submit a new link" dismissModal={dismissModal} isActive={true}>
    <SubmitForm history={history} />
  </Modal>
);

SubmitModal.propTypes = {
  dismissModal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default SubmitModal;
