import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import { createEpicMiddleware } from "redux-observable";
import { routerMiddleware } from "react-router-redux";
import { history } from "models/History";
import reducers from "reducers";
import epics from "epics";
import { dev } from "constants.js";

const epicMiddleware = createEpicMiddleware(epics);

let middleware = [routerMiddleware(history), epicMiddleware];

if (dev) {
  middleware = [createLogger(), ...middleware];
}

const configureStore = compose(applyMiddleware(...middleware))(createStore);

const store = configureStore(reducers, {});

export default store;
