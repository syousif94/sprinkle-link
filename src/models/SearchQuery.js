import store from "models/Store";
import { now } from "lib/time";

export default (count = false) => {
  const {
    search: { query: text, sortBy, openNow, bounds }
  } = store.getState();

  const filters = {
    sortBy
  };

  if (openNow) {
    filters.openNow = true;
    filters.now = now();
  }

  const body = {
    bounds,
    filters,
    uid: "web"
  };

  const tags = text
    .trim()
    .split(" ")
    .filter(tag => tag.length);

  if (tags.length) {
    body.tags = tags;
  }

  if (count) {
    body.count = true;
  }

  return body;
};
