import React, { Component } from "react";
import { connect } from "react-redux";

import styles from "./styles.css";

import * as Search from "reducers/search";

class SearchBox extends Component {
  _onChange = e => {
    const query = e.target.value;
    this.props.setSearch({ query });
  };

  render() {
    return (
      <div className={styles.searchBox}>
        <input
          placeholder="Search, ex. tacos in austin"
          className={styles.input}
          type="text"
          onChange={this._onChange}
          value={this.props.value}
        />
      </div>
    );
  }
}

const state = state => ({
  value: state.search.query
});

const dispatch = {
  setSearch: Search.actions.set
};

export default connect(
  state,
  dispatch
)(SearchBox);
