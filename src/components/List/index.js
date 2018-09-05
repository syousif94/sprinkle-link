import React, { Component } from "react";
import VirtualList from "react-tiny-virtual-list";
import EventEmitter from "eventemitter3";
import Media from "react-media";

import { query } from "constants.js";
import store from "models/Store";

export default class List extends Component {
  static emitter = new EventEmitter();

  componentDidMount() {
    List.emitter.addListener("selected", this._onSelected);
  }

  componentDidUpdate() {
    const {
      data: { selected }
    } = store.getState();

    this._onSelected(selected);
  }

  componentWillUnmount() {
    List.emitter.removeAllListeners();
  }

  _onSelected = selected => {
    if (!selected) {
      return;
    }

    let index = this.props.keys.findIndex(key => key === selected);

    if (index < 0) {
      index = 0;
    }

    const dimension = window.innerWidth > query.wide ? 150 : 270;

    this._listRef.scrollTo(index * dimension);
  };

  _setListRef = ref => {
    this._listRef = ref;
  };

  _renderItem = ({ index, style }) => {
    const { keys, Item } = this.props;

    const key = keys[index];

    return <Item style={style} index={index} id={key} key={key} />;
  };

  _renderList = narrow => {
    const { keys } = this.props;

    const listProps = {
      scrollDirection: "vertical",
      width: "100%",
      height: window.innerHeight - 140,
      itemSize: 150
    };

    if (narrow) {
      listProps.scrollDirection = "horizontal";
      listProps.height = "100%";
      listProps.width = window.innerWidth;
      listProps.itemSize = 270;
    }

    return (
      <VirtualList
        ref={this._setListRef}
        itemCount={keys.length}
        renderItem={this._renderItem}
        {...listProps}
      />
    );
  };

  render() {
    return <Media query={{ maxWidth: query.wide }}>{this._renderList}</Media>;
  }
}
