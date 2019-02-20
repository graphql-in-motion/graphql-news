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
      <div className="submit-form-wrapper">
        <Mutation mutation={SUBMIT_LINK_MUTATION} variables={{ url }}>
          {mutate => (
            <form onSubmit={mutate}>
              <div  className="submit-form-content">
                <input
                  type="text"
                  value={url}
                  onChange={e => this.onChange(e)}
                  placeholder="Enter a URL..."
                />

                <input
                  type="submit"
                  className={`submit-button-${
                    url.length > 0 && isValid ? "active" : "disabled"
                  }`}
                  value="Submit"
                  disabled={!isValid}
                />
              </div>

              {url.length > 0 && !isValid ? (
                <div className="validation-error">
                  <p>Please enter a valid URL</p>
                </div>
              ) : null}
            </form>
          )}
        </Mutation>
      </div>
    );
  }
}
