import React from "react";
import { Route, Redirect } from "react-router-dom";

// Components
import VideoRoom from "./VideoRoom";

// Utility components, functions, constants, objects...
import { AVAILABLE_PATHS, Loading } from "../utilities";

// Custom route for the video room to redirect user if user is not logged in
function VideoRoomRoute(props) {
  const { userData, printFeedback, ...restOfProps } = props;
  const { isUserLoggedIn, isDataArrived } = userData;
  return (
    <Route
      {...restOfProps}
      render={(routerProps) =>
        isDataArrived && !isUserLoggedIn ? (
          <Redirect to={AVAILABLE_PATHS.LOGIN_PATH} exact />
        ) : isDataArrived && isUserLoggedIn ? (
          <VideoRoom
            userData={userData}
            printFeedback={printFeedback}
            {...routerProps}
          />
        ) : (
          <Loading />
        )
      }
    />
  );
}

export default VideoRoomRoute;
