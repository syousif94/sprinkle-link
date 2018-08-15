import { combineReducers } from "redux";
import Immutable from "immutable";
import { createActions } from "lib/actions";
import { createSelector } from "reselect";

const mutations = ["set", "get"];

export const { actions, types } = createActions(mutations, "search");

export const tagList = createSelector(
  state => state.search.query,
  state => state.search.popular,
  state => state.search.suggestions,
  (query, popular, suggestions) => {
    if (query.length && suggestions.length) {
      return suggestions;
    } else {
      return popular;
    }
  }
);

export default combineReducers({
  sortBy: function(state = 2, { type, payload }) {
    switch (type) {
      case types.set:
        return payload.sortBy ? payload.sortBy : state;
      default:
        return state;
    }
  },
  query: function(state = "", { type, payload }) {
    switch (type) {
      case types.set:
        return payload.query || payload.query === "" ? payload.query : state;
      default:
        return state;
    }
  },
  resultCount: function(state = 0, { type, payload }) {
    switch (type) {
      case types.set:
        return payload.resultCount ? payload.resultCount : state;
      default:
        return state;
    }
  },
  popular: function(state = [], { type, payload }) {
    switch (type) {
      case types.set:
        return payload.popular ? payload.popular : state;
      default:
        return state;
    }
  },
  suggestions: function(state = [], { type, payload }) {
    switch (type) {
      case types.set:
        return payload.suggestions ? payload.suggestions : state;
      default:
        return state;
    }
  },
  bounds: function(state = {}, { type, payload }) {
    switch (type) {
      case types.set:
        return payload.bounds ? payload.bounds : state;
      default:
        return state;
    }
  }
});
