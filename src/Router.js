import React, { Component } from "react";
import { Route } from "react-router";
import { ConnectedRouter } from "react-router-redux";

import { history } from "models/History";

import Chrome from "components/Chrome";
import Home from "components/Home";

class Router extends Component {
  render() {
    return (
      <ConnectedRouter history={history}>
        <Chrome>
          <Route exact path="/" component={Home} />
        </Chrome>
      </ConnectedRouter>
    );
  }
}

export default Router;
