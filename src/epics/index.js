import { combineEpics } from "redux-observable";
// import routes from './routes';
import suggestions from "./suggestions";

export default combineEpics(suggestions);
