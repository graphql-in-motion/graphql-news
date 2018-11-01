/* eslint-disable no-script-url */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faClock,
  faComment,
  faEye,
  faTrash
} from "@fortawesome/free-solid-svg-icons";

import DestroyModal from "../../Modal/Destroy";

library.add(faBookmark, faClock, faComment, faEye, faTrash);

export default class Meta extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false
    };

    this.showModal = this.showModal.bind(this);
    this.dismissModal = this.dismissModal.bind(this);
  }

  static propTypes = {
    author: PropTypes.string.isRequired,
    commentsLength: PropTypes.number.isRequired,
    id: PropTypes.string
  };

  showModal(action) {
    this.setState({
      showModal: true
    });
  }

  dismissModal() {
    this.setState({
      showModal: false
    });
  }

  render() {
    const { _id, author, commentsLength, createdAt } = this.props;

    return (
      <div className="meta-wrapper">
        {this.state.showModal ? (
          <DestroyModal id={_id} dismissModal={this.dismissModal} />
        ) : null}
        <ul className="meta-list">
          <li className="meta-item">
            <span style={{ marginRight: '4px' }}>by</span>
            <span className="username">
              <Link to={`/user/${author}`}>{author}</Link>
            </span>
          </li>
          <li className="meta-item">
            <FontAwesomeIcon className="fa-icon" icon="clock" />
            <span>{moment(createdAt, "{YYYY} MM-DDTHH:mm:ss SSS [Z] A").fromNow()}</span>
          </li>
          <li className="meta-item">
            <Link to={`/link/${_id}`}>
              <FontAwesomeIcon className="fa-icon" icon="comment" />
              <span>{commentsLength} {commentsLength !== 1 ? 'comments' : 'comment'}</span>
            </Link>
          </li>
          <li className="meta-item">
            <FontAwesomeIcon className="fa-icon" icon="bookmark" />
            <span>Save</span>
          </li>
          <li className="meta-item">
            <button
              className="admin-delete-button"
              onClick={() => this.showModal()}
            >
              <FontAwesomeIcon className="fa-icon" icon="trash" />
              <span>Delete</span>
            </button>
          </li>
        </ul>
      </div>
    );
  }
}
