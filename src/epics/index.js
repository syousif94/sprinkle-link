import { combineEpics } from "redux-observable";
// import routes from './routes';
import suggestions from "./suggestions";
import resultCount from "./resultCount";

export default combineEpics(suggestions, resultCount);
