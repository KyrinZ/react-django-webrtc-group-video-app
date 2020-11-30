import jwt_decode from "jwt-decode";

import axiosInstance, { checkTokenValidity } from "./axios";

const isUserAuthenticate = () => {
  const refresh_token = localStorage.getItem("refresh_token");
  if (checkTokenValidity(axiosInstance, refresh_token)) {
    const userId = jwt_decode(refresh_token).user_id;
    return {
      userId: userId,
      userType: "Registered",
      isUserLoggedIn: true,
    };
  } else {
    return {
      userId: null,
      userType: "Anonymous",
      isUserLoggedIn: false,
    };
  }
};

export default isUserAuthenticate;
