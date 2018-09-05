import React, { Component } from "react";
import { connect } from "react-redux";

import styles from "./styles.css";
import Suggestion from "./Suggestion";

class Suggestions extends Component {
  componentDidUpdate() {
    this._scrollRef.scrollLeft = 0;
  }

  _renderSuggestions = () => {
    return this.props.items.map((tag, index) => (
      <Suggestion key={index} tag={tag} index={index} />
    ));
  };

  _scrollRef;

  _setScrollRef = ref => {
    this._scrollRef = ref;
  };

  render() {
    return (
      <div className={styles.suggestions} ref={this._setScrollRef}>
        <div className={styles.scroll}>{this._renderSuggestions()}</div>
      </div>
    );
  }
}

const state = state => ({
  items: state.search.cities
});
export default connect(state)(Suggestions);
