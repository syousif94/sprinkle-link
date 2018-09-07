import * as Search from "reducers/search";
import api from "lib/api";
import defer from "lib/defer";
import SearchQuery from "models/SearchQuery";

const defined = val => val !== undefined;

export default action$ =>
  action$
    .ofType(Search.types.set)
    .filter(action => {
      const {
        payload: { sortBy, openNow, query, bounds }
      } = action;

      const shouldCount =
        defined(sortBy) ||
        defined(openNow) ||
        defined(query) ||
        defined(bounds);

      return shouldCount;
    })
    .switchMap(
      defer(async () => {
        try {
          const res = await api("query", SearchQuery(true), 7);
          const count = res.dishes;
          return Search.actions.set({ count });
        } catch (error) {
          console.log({ resultCount: error });
        }
      })
    )
    .filter(action => action);
