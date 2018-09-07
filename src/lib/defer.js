import { Observable } from "rxjs/Observable";

export default func => () => {
  return Observable.defer(func);
};
