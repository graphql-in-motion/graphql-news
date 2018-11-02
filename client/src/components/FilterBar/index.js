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
        {showSortMenu && (
          <div className="filter-menu">
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
    );
  }
}
