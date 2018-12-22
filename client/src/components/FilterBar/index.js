import React, { Component } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faSearch, faCertificate, faComment } from "@fortawesome/free-solid-svg-icons";

library.add(faFire, faSearch, faCertificate, faComment);

export default class FilterBar extends Component {
  state = {
    sortBy: "top",
    icon: "fire",
    showSortMenu: false
  };

  render() {
    const { sortBy, showSortMenu, icon } = this.state;

    return (
      <div className="filter-bar-wrapper">
        <span className="sort-label">Sort By</span>
        <button
          className="sort-button"
          onClick={() =>
            this.setState({ showSortMenu: !showSortMenu })
          }
        >
          <FontAwesomeIcon className="fa-icon" icon={icon} />{sortBy}
        </button>
        <div className="popup-wrapper">
          {showSortMenu && (
            <div className="filter-menu">
              <div className="menu-arrow">
                <svg
                  aria-label="up-arrow"
                  className="up-arrow"
                  height="7"
                  id="svg-up-arrow"
                  role="img"
                  version="1.1"
                  viewBox="0 0 11 7"
                  width="11"
                >
                  <path d="m.202 5.715c-.367.417-.217.755.329.755h9.438c.549 0 .702-.33.338-.742l-4.41-4.985c-.363-.41-.947-.412-1.322.013l-4.373 4.96" />
                </svg>
              </div>
              <button
                className={`filter-option ${sortBy === 'new' ? 'active' : ''}`}
                onClick={() =>
                  this.setState({ sortBy: 'new', icon: 'certificate' })
                }
              >
                <FontAwesomeIcon className="fa-icon" icon="certificate" />New
              </button>
              <button
                className={`filter-option ${sortBy === 'top' ? 'active' : ''}`}
                onClick={() =>
                  this.setState({ sortBy: 'top', icon: 'fire' })
                }
              >
                <FontAwesomeIcon className="fa-icon" icon="fire" />Top
              </button>
              <button
                className={`filter-option ${sortBy === 'comments' ? 'active' : ''}`}
                onClick={() =>
                  this.setState({ sortBy: 'comments', icon: 'comment' })
                }
              >
                <FontAwesomeIcon className="fa-icon" icon="comment" />Comments
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
