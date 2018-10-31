import React from 'react';

const Modal = ({ children, headerText }) => (
  <div className="modal-content-wrapper">
    <div className="modal-container">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{headerText}</h2>
        </div>
        {children}
      </div>
    </div>
    <div className="modal-overlay"></div>
  </div>
);

export default Modal;