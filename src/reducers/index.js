import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import data from "./data";
import search from "./search";

export default combineReducers({
  router: routerReducer,
  data,
  search
});
