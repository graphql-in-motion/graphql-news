/* global localStorage */
/* eslint-disable no-script-url */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faClock, faComment, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import DestroyModal from '../../Modal/Destroy';
import { AUTH_TOKEN } from '../../../constants';

library.add(faBookmark, faClock, faComment, faEye, faTrash);

const GET_CLIENT_USER = gql`
  query GetUser {
    User @client {
      _id
      username
    }
  }
`;

export default class Meta extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      user: null,
      token: localStorage.getItem(AUTH_TOKEN),
    };

    this.showModal = this.showModal.bind(this);
    this.dismissModal = this.dismissModal.bind(this);
  }

  static propTypes = {
    author: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    commentsLength: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  };

  showModal() {
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
    const { _id, author, commentsLength, createdAt, authorId } = this.props;
    const { showModal } = this.state;

    return (
      <div className="meta-wrapper">
        <ul className="meta-list">
          <li className="meta-item">
            <span style={{ marginRight: '2px' }}>by</span>
            <span className="username">{author}</span>
          </li>
          <li className="meta-item">
            <FontAwesomeIcon className="fa-icon" icon="clock" />
            <span>{moment(createdAt, '{YYYY} MM-DDTHH:mm:ss SSS [Z] A').fromNow()}</span>
          </li>
          <li className="meta-item">
            <Link to={`/link/${_id}`}>
              <FontAwesomeIcon className="fa-icon" icon="comment" />
              <span>
                {commentsLength} {commentsLength !== 1 ? 'comments' : 'comment'}
              </span>
            </Link>
          </li>
          <Query query={GET_CLIENT_USER}>
            {({ data }) => {
              const { token } = this.state;
              const { User } = data;
              const isAuthenticated = token && User._id && User.username;

              if (isAuthenticated && authorId === User._id) {
                return (
                  <li className="meta-item">
                    <button className="admin-delete-button" onClick={() => this.showModal()}>
                      <FontAwesomeIcon className="fa-icon" icon="trash" />
                      <span>Delete</span>
                    </button>

                    {showModal && isAuthenticated ? (
                      <DestroyModal
                        id={_id}
                        dismissModal={this.dismissModal}
                        isActive={this.state.showModal}
                      />
                    ) : null}
                  </li>
                );
              }

              return <React.Fragment />;
            }}
          </Query>
        </ul>
      </div>
    );
  }
}
