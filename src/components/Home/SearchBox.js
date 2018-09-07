import React, { Component } from "react";
import { connect } from "react-redux";
import EventEmitter from "eventemitter3";

import styles from "./styles.css";
import ResultCount from "./ResultCount";
import Spinner from "components/Spinner";
import ClearButton from "components/ClearButton";

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

  _onClear = () => {
    const query = "";
    this.props.setSearch({ query });
  };

  render() {
    const { value, loading } = this.props;

    const clear = !value || !value.length;

    return (
      <div className={styles.searchBox}>
        <input
          ref={this._setInputRef}
          placeholder="tacos, brunch, asian, etc."
          className={styles.input}
          type="search"
          onChange={this._onChange}
          value={value}
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
        />
        <ResultCount />
        <Spinner className={styles.searchLoading} visible={loading} />
        <ClearButton
          className={styles.clearSearch}
          visible={clear}
          onClick={this._onClear}
        />
      </div>
    );
  }
}

const state = state => ({
  value: state.search.query,
  loading: state.search.loading
});

const dispatch = {
  setSearch: Search.actions.set
};

export default connect(
  state,
  dispatch
)(SearchBox);
