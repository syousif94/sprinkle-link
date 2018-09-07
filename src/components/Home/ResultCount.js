import React from "react";
import { connect } from "react-redux";

import styles from "./styles";

const ResultCount = count => (
  <div className={styles.resultCount}>
    <div className={styles.count}>{count}</div>
  </div>
);

const mapStateToProps = state => ({
  count: state.search.count
});

export default connect(mapStateToProps)(ResultCount);
