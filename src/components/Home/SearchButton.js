import React, { Component } from "react";
import { connect } from "react-redux";

import styles from "./styles.css";

import * as Search from "reducers/search";

class SearchButton extends Component {
  render() {
    return (
      <div className={styles.searchButton}>
        <i className="fas fa-search" />
      </div>
    );
  }
}

const dispatch = {
  getSearch: Search.actions.get
};

export default connect(
  null,
  dispatch
)(SearchButton);
