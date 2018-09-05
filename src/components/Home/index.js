import React, { Component } from "react";
import { connect } from "react-redux";

import List from "components/List";
import Sidebar from "components/Sidebar";

import styles from "./styles.css";
import DishResult from "./DishResult";
import SearchBox from "./SearchBox";
import Cities from "./Cities";
import Suggestions from "./Suggestions";

const ConnectedList = connect((state, props) => ({
  keys: state.data.results
}))(List);

export default class Home extends Component {
  render() {
    return (
      <Sidebar>
        <div className={styles.search}>
          <Cities />
          <SearchBox />
          <Suggestions />
        </div>
        <ConnectedList Item={DishResult} />
      </Sidebar>
    );
  }
}
