/* eslint-disable no-script-url */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import DestroyModal from '../../Modal/Destroy';

export default class Meta extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    }

    this.showModal = this.showModal.bind(this);
    this.dismissModal = this.dismissModal.bind(this);
  }

  static propTypes = {
    author: PropTypes.string.isRequired,
    commentsLength: PropTypes.number.isRequired,
    id: PropTypes.string,
  }

  showModal(action) {
    this.setState({
      showModal: true,
    });
  }

  dismissModal() {
    this.setState({
      showModal: false,
    });
  }

  render() {
    const {
      _id,
      author,
      commentsLength
    } = this.props;

    return (
      <div className="meta-wrapper">
        {this.state.showModal ? <DestroyModal id={_id} dismissModal={this.dismissModal} /> : null}
        <span>
          by <a href="javascript:void(0);">{author}</a> 3 hours ago
        </span>
        <span style={{ margin: '0 0.25em' }}>|</span>
        <span>
          <a href="javascript:void(0);">hide</a>
        </span>
        <span style={{ margin: '0 0.25em' }}>|</span>
        <span>
          <Link to={`/link/${_id}`}>{commentsLength} comment{commentsLength !== 1 ? 's' : ''}</Link>
        </span>
        <span style={{ margin: '0 0.25em' }}>|</span>
        <button className="admin-delete-button" onClick={() => this.showModal()}>
          delete
        </button>
      </div>
    );
  }
}
