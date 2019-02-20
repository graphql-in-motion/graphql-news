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
import gql from "graphql-tag";
import { client } from "../../../root";

import DestroyModal from "../../Modal/Destroy";
import { AUTH_TOKEN } from "../../../constants";

library.add(faBookmark, faClock, faComment, faEye, faTrash);

export default class Meta extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      user: null,
      token: localStorage.getItem(AUTH_TOKEN)
    };

    this.showModal = this.showModal.bind(this);
    this.dismissModal = this.dismissModal.bind(this);
  }

  static propTypes = {
    author: PropTypes.string.isRequired,
    commentsLength: PropTypes.number.isRequired,
    id: PropTypes.string
  };

  componentWillMount() {
    this.getUserData();
  }

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

  async getUserData() {
    if (this.state.token) {
      const { data: { user } } = await client.query({
        query: gql`
          query GetUser {
            user {
              links {
                _id
              }
            }
          }
        `
      });

      this.setState({ user });
    }
  }

  render() {
    const { _id, author, commentsLength, createdAt } = this.props;
    const { user, showModal, token } = this.state;

    const isAuthenticated = token && user;

    let isOwnLink = false;
    if (isAuthenticated) {
      isOwnLink = user.links.map(i => i._id === _id).includes(true);
    }

    return (
      <div className="meta-wrapper">
        {showModal &&
          isAuthenticated && (
            <DestroyModal
              id={_id}
              dismissModal={this.dismissModal}
              isActive={this.state.showModal}
            />
          )}
        <ul className="meta-list">
          <li className="meta-item">
            <span style={{ marginRight: "2px" }}>by</span>
            <span className="username">
              {author}
            </span>
          </li>
          <li className="meta-item">
            <FontAwesomeIcon className="fa-icon" icon="clock" />
            <span>
              {moment(createdAt, "{YYYY} MM-DDTHH:mm:ss SSS [Z] A").fromNow()}
            </span>
          </li>
          <li className="meta-item">
            <Link to={`/link/${_id}`}>
              <FontAwesomeIcon className="fa-icon" icon="comment" />
              <span>
                {commentsLength} {commentsLength !== 1 ? "comments" : "comment"}
              </span>
            </Link>
          </li>
          {/* <li className="meta-item">
            <FontAwesomeIcon className="fa-icon" icon="bookmark" />
            <span>Save</span>
          </li> */}
          {isOwnLink && (
            <li className="meta-item">
              <button
                className="admin-delete-button"
                onClick={() => this.showModal()}
              >
                <FontAwesomeIcon className="fa-icon" icon="trash" />
                <span>Delete</span>
              </button>
            </li>
          )}
        </ul>
      </div>
    );
  }
}
