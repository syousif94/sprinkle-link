import _ from "lodash";
import Colors from "styles/colors.css";
import Query from "styles/query.css";

export const colors = Colors;
export const query = _.mapValues(Query, value => {
  return Number(value.replace("px", ""));
});

export const sortBy = ["Best", "Cheapest", "Newest", "Closest"];

export const dev = process.env.NODE_ENV === "development";
