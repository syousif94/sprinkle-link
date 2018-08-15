import React, { Component } from "react";
import { connect } from "react-redux";

import List from "components/List";
import Sidebar from "components/Sidebar";

import styles from "./styles.css";
import DishResult from "./DishResult";
import SearchBox from "./SearchBox";
import SearchButton from "./SearchButton";
import Suggestions from "./Suggestions";

const ConnectedList = connect((state, props) => ({
  keys: state.data.results
}))(List);

export default class Home extends Component {
  render() {
    return (
      <Sidebar>
        <div className={styles.search}>
          <div className={styles.searchRow}>
            <SearchBox />
            <SearchButton />
          </div>
          <div className={styles.searchRow}>
            <Suggestions />
          </div>
        </div>
        <ConnectedList Item={DishResult} />
      </Sidebar>
    );
  }
}
