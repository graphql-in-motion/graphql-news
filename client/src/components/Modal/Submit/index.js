import React, { Component } from 'react';
import Modal from '../';

class SubmitForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: '',
      isValid: false,
    }

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { url } = this.state;
    const isValid = this.validateUrl(url);

    if (isValid) {
      return this.setState({
        url: e.target.value,
        isValid,
      });
    }

    return this.setState({
      url: e.target.value,
    });
  }

  validateUrl(string) {
    return /[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(string);
  }

  render() {
    const { url, isValid } = this.state;

    return (
      <div className="submit-form-wrapper flex justify-content-center">
        <div className="submit-form-content">
          <form className="justify-content-between align-items-center">
            <input type="text" value={url} onChange={e => this.onChange(e)} placeholder="Enter a URL..." />
            {(url.length > 0) && !isValid ? (
              <div className="validation-error">
                <p>Please enter a valid URL</p>
              </div>
            ) : null}
            <div className="submit-form-action-area">
              <button className={`modal-action-button submit-button-${(url.length > 0) && isValid ? 'active' : 'disabled'}`}>Submit</button>
              <span className="instructions">Or, press <code>enter</code> to submit</span>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const SubmitModal = () => (
  <Modal headerText="Submit a new link">
      <SubmitForm />
  </Modal>
);

export default SubmitModal;
