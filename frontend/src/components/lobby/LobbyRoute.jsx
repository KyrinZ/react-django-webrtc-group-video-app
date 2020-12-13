import React from "react";
import { Route } from "react-router-dom";

import RoomList from "./RoomList";

// Custom route component to pass extra props to RoomList component
function LobbyRoute(props) {
  const { lobbyProps, ...restOfProps } = props;
  return (
    <Route
      {...restOfProps}
      render={(routerProps) => <RoomList {...lobbyProps} {...routerProps} />}
    />
  );
}

export default LobbyRoute;
