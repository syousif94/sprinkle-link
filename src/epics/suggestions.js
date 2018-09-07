import { combineEpics } from "redux-observable";
import ReconnectingWebSocket from "ReconnectingWebSocket";

import store from "models/Store";
import * as Search from "reducers/search";
import api from "lib/api";
import defer from "lib/defer";

const socket = new ReconnectingWebSocket(
  "wss://sprinkle.ideakeg.xyz/api/v3/search/tags"
);

socket.addEventListener("message", e => {
  const suggestions = JSON.parse(e.data);

  const action = Search.actions.set({
    suggestions
  });

  store.dispatch(action);
});

const suggested = (action$, store) =>
  action$
    .ofType(Search.types.set)
    .filter(action => {
      const {
        search: { query }
      } = store.getState();
      return (
        query.length &&
        socket.readyState === 1 &&
        (action.payload.query || action.payload.bounds)
      );
    })
    .do(() => {
      const {
        search: { query, bounds }
      } = store.getState();

      const data = JSON.stringify({
        bounds,
        query
      });

      socket.send(data);
    })
    .filter(() => false);

const popular = (action$, store) =>
  action$
    .ofType(Search.types.set)
    .filter(action => action.payload.bounds)
    .switchMap(
      defer(async () => {
        const {
          search: { bounds }
        } = store.getState();

        try {
          const res = await api(
            "popular",
            {
              bounds
            },
            3
          );

          const popular = res.tags;

          return Search.actions.set({
            popular
          });
        } catch (error) {
          console.log({ error });
          return null;
        }
      })
    )
    .filter(action => action);

const cities = (action$, store) =>
  action$
    .ofType(Search.types.set)
    .filter(action => action.payload.bounds)
    .switchMap(
      defer(async () => {
        const {
          search: { bounds }
        } = store.getState();

        try {
          const res = await api("popular-cities", {
            bounds
          });

          const cities = res.cities;

          return Search.actions.set({
            cities
          });
        } catch (error) {
          console.log({ error });
          return null;
        }
      })
    )
    .filter(action => action);

export default combineEpics(popular, suggested, cities);
