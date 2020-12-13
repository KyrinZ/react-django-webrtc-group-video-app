import axios from "axios";

// Utility functions, constants, objects...
import { BASE_API_URL } from "./CONSTANTS";

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("access_token"),
  },
});
export default axiosInstance;

export const getRoomsList = (axiosInstance, search = "") => {
  delete axiosInstance.defaults.headers["Authorization"];

  if (search !== "") {
    return axiosInstance.get(`rooms/?search=${search}`);
  }

  return axiosInstance.get("rooms/");
};

export const validateToken = (axiosInstance, token) => {
  return axiosInstance.post("token/verify/", {
    token: token,
  });
};

export const refreshingAccessToken = () => {
  const access_token = localStorage.getItem("access_token");
  validateToken(axiosInstance, access_token)
    .then((response) => {
      if (response.status === 200) {
        axiosInstance.defaults.headers["Authorization"] =
          "Bearer " + access_token;
      }
    })
    .catch((error) => {
      const refresh_token = localStorage.getItem("refresh_token");
      if (
        (error.response.status === 400 || error.response.status === 401) &&
        refresh_token
      ) {
        axiosInstance
          .post("token/refresh/", {
            refresh: refresh_token,
          })
          .then(({ status, data }) => {
            if (status === 200) {
              localStorage.setItem("access_token", data.access);
              axiosInstance.defaults.headers["Authorization"] =
                "Bearer " + data.access;
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    });
};
