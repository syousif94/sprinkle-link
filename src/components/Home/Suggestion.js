import React, { Component } from "react";
import { connect } from "react-redux";

import * as Search from "reducers/search";
import store from "models/Store";

import styles from "./styles.css";
import SearchBox from "components/Home/SearchBox";
import MapView from "components/MapView";

class Suggestion extends Component {
  _onClick = e => {
    e.preventDefault();

    const { tag } = this.props;

    if (tag.bounds) {
      MapView.emitter.emit("bounds", tag.bounds);
      return;
    }

    const {
      search: { query: current }
    } = store.getState();

    const text = tag.text;

    const lastChar = current.substring(current.length - 1);

    let query;

    if (lastChar !== " ") {
      const splitQuery = current.split(" ");
      const lastIndex = splitQuery.length - 1;
      splitQuery[lastIndex] = text;
      query = `${splitQuery.join(" ")} `;
    } else {
      query = `${current}${text} `;
    }

    this.props.setSearch({
      query
    });

    SearchBox.emitter.emit("focus");

    MapView.emitter.emit("search");
  };
  render() {
    const { tag, index } = this.props;
    return (
      <div className={styles.suggestion} onClick={this._onClick}>
        <div className={styles.index}>{index + 1}.</div>
        <div className={styles.text}>{tag.text}</div>
        <TagCount count={tag.count} />
      </div>
    );
  }
}

const TagCount = ({ count }) =>
  count ? <div className={styles.count}>{count}</div> : null;

const dispatch = {
  setSearch: Search.actions.set
};

export default connect(
  null,
  dispatch
)(Suggestion);
