import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

import { AVAILABLE_PATHS } from "./CONSTANTS";

class AuthenticationRoute extends Component {
  render() {
    const {
      component: Component,
      isUserLoggedIn,
      redirectPath,
      path,
      authenticationProps,
      ...restOfProps
    } = this.props;

    return (
      <Route
        path={path}
        {...restOfProps}
        render={(routerProps) =>
          !isUserLoggedIn ? (
            <Component
              redirectPath={AVAILABLE_PATHS.LOBBY_PATH}
              {...routerProps}
              {...authenticationProps}
            />
          ) : (
            <Redirect to={AVAILABLE_PATHS.LOBBY_PATH} exact />
          )
        }
      />
    );
  }
}

export default AuthenticationRoute;
