import React, { Component } from "react";
import { connect } from "react-redux";

import List from "components/List";
import Sidebar from "components/Sidebar";

import styles from "./styles.css";
import DishResult from "./DishResult";
import SearchBox from "./SearchBox";
import Cities from "./Cities";
import Suggestions from "./Suggestions";
import OrderSelect from "./OrderSelect";
import OpenNow from "./OpenNow";
import LocateButton from "./LocateButton";
import ZoomOut from "./ZoomOut";

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
          <div className={styles.searchButtons}>
            <OrderSelect />
            <OpenNow />
            <LocateButton />
            <ZoomOut />
          </div>
        </div>
        <ConnectedList Item={DishResult} />
      </Sidebar>
    );
  }
}
