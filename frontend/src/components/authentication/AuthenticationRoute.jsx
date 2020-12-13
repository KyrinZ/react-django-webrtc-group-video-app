import React from "react";
import { Route, Redirect } from "react-router-dom";

import { AVAILABLE_PATHS } from "../utilities/CONSTANTS";

// User is redirected to home if user is already authenticated
function AuthenticationRoute(props) {
  const { component: Component, authenticationProps, ...restOfProps } = props;
  return (
    <Route
      {...restOfProps}
      render={(routerProps) =>
        !authenticationProps.isUserLoggedIn ? (
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

export default AuthenticationRoute;
