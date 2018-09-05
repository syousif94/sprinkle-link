import React, { Component } from "react";
import { connect } from "react-redux";
import EventEmitter from "eventemitter3";

import styles from "./styles.css";

import * as Search from "reducers/search";

class SearchBox extends Component {
  static emitter = new EventEmitter();

  componentDidMount() {
    SearchBox.emitter.on("focus", this._focus);
  }

  componentWillUnmount() {
    SearchBox.emitter.removeAllListeners();
  }

  _focus = () => {
    this._inputRef.focus();
  };

  _setInputRef = ref => {
    this._inputRef = ref;
  };

  _onChange = e => {
    const query = e.target.value;
    this.props.setSearch({ query });
  };

  render() {
    return (
      <div className={styles.searchBox}>
        <input
          ref={this._setInputRef}
          placeholder="tacos, brunch, asian, etc."
          className={styles.input}
          type="search"
          onChange={this._onChange}
          value={this.props.value}
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
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
