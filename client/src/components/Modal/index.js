import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

library.add(faTimes);

const Modal = ({ children, headerText }) => (
  <div className="modal-content-wrapper">
    <div className="modal-container">
      <div className="modal-content">
        <div className="modal-header flex justify-content-between">
          <h2>{headerText}</h2>
          <button className="modal-close-button">
            <FontAwesomeIcon className="modal-close-icon" icon="times" />
          </button>
        </div>
        {children}
      </div>
    </div>
    <div className="modal-overlay"></div>
  </div>
);

export default Modal;