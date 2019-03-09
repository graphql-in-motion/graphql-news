import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

library.add(faTimes);

export default class Banner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: true,
    };

    this.dismissBanner = this.dismissBanner.bind(this);
  }

  dismissBanner() {
    this.setState({ isActive: false });
  }

  render() {
    return this.state.isActive ? (
      <div className="banner">
        <div className="banner-content">
          <p>
            Welcome to GraphQL News! This is the finished client for the{' '}
            <a
              href="https://www.manning.com/livevideo/graphql-in-motion"
              target="_blank"
              rel="noopener noreferrer"
            >
              GraphQL In Motion
            </a>{' '}
            {`video course. If you're interested in exploring the API, head over to the`}{' '}
            <a href="./api/graphql">playground</a>!
          </p>

          <button className="banner-close-button" onClick={this.dismissBanner}>
            <FontAwesomeIcon className="modal-close-icon" icon="times" />
          </button>
        </div>
      </div>
    ) : null;
  }
}
