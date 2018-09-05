import React, { Component } from "react";
import styles from "./styles.css";

import VirtualList from "react-tiny-virtual-list";
import EventEmitter from "eventemitter3";

export default class List extends Component {
  static emitter = new EventEmitter();

  componentDidMount() {
    List.emitter.addListener("selected", this._onSelected);
  }

  componentWillUnmount() {
    List.emitter.removeAllListeners();
  }

  _onSelected = e => {
    if (!e) {
      return;
    }

    const index = this.props.keys.findIndex(key => key === e);

    this._listRef.scrollTo(index * 150);
  };

  _setListRef = ref => {
    this._listRef = ref;
  };

  _renderItem = ({ index, style }) => {
    const { keys, Item } = this.props;

    const key = keys[index];

    return <Item style={style} index={index} id={key} key={key} />;
  };

  render() {
    const { keys } = this.props;
    return (
      <div className={styles.container}>
        <VirtualList
          ref={this._setListRef}
          width="100%"
          height={window.innerHeight - 85}
          itemCount={keys.length}
          itemSize={150}
          renderItem={this._renderItem}
        />
      </div>
    );
  }
}
