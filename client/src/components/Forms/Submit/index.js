import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const SUBMIT_LINK_MUTATION = gql`
  mutation SubmitLink($url: String!) {
    createLink(url: $url) {
      _id
      author {
        _id
        username
      }
      created_at
      comments {
        _id
      }
      description
      score
      url
    }
  }
`;

export default class SubmitForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: "",
      isValid: false
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { url } = this.state;
    const isValid = /[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(
      url
    );

    if (isValid) {
      return this.setState({
        url: e.target.value,
        isValid
      });
    }

    return this.setState({
      url: e.target.value
    });
  }

  render() {
    const { url, isValid } = this.state;

    return (
      <div className="submit-form-wrapper flex justify-content-center">
        <div className="submit-form-content">
          <Mutation mutation={SUBMIT_LINK_MUTATION} variables={{ url }}>
            {mutate => (
              <form
                className="justify-content-between align-items-center"
                onSubmit={mutate}
              >
                <input
                  type="text"
                  value={url}
                  onChange={e => this.onChange(e)}
                  placeholder="Enter a URL..."
                />
                {url.length > 0 && !isValid ? (
                  <div className="validation-error">
                    <p>Please enter a valid URL</p>
                  </div>
                ) : null}
                <div className="submit-form-action-area">
                  <input
                    type="submit"
                    className={`modal-action-button submit-button-${
                      url.length > 0 && isValid ? "active" : "disabled"
                    }`}
                    value="Submit"
                  />
                  <span className="instructions">
                    Or, press <code>enter</code> to submit
                  </span>
                </div>
              </form>
            )}
          </Mutation>
        </div>
      </div>
    );
  }
}
