export const BASE_API_URL = window.location.origin + "/api/";  //  Use this for if you wanna serve it Django
// export const BASE_API_URL = "http://127.0.0.1:8000/api/";   // Use this for stand-alone app 
export const webSocketUrl = () => {
  let websocketProtocol;
  if (window.location.protocol === "https:") {
    websocketProtocol = "wss://";
  } else {
    websocketProtocol = "ws://";
  }
  return websocketProtocol + window.location.host + "/video/"; //  Use this for if you wanna serve it Django
  // return websocketProtocol + "127.0.0.1:8000/video/";        // Use this for stand-alone app 
};

export const AVAILABLE_PATHS = {
  LOBBY_PATH: "/",
  LOGIN_PATH: "/login",
  REGISTER_PATH: "/register",
  VIDEO_ROOM_PATH: "/video/:roomId",
};

export const ALL_PATH_TITLES = {
  LOBBY_TITLE: "Lobby",
  LOGIN_TITLE: "Login",
  REGISTER_TITLE: "Register",
  LOGOUT_TITLE: "Logout",
};
