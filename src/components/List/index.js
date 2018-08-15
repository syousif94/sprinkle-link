import React, { Component } from "react";
import styles from "./styles.css";

export default class List extends Component {
  setScrollTop = (y = 0) => {
    this._list.scrollTop = y;
  };
  _setListRef = ref => {
    this._list = ref;
  };
  render() {
    const { keys, Item } = this.props;
    return (
      <div className={styles.container} ref={this._setListRef}>
        {keys.map((key, index) => (
          <Item index={index} id={key} key={key} />
        ))}
      </div>
    );
  }
}
