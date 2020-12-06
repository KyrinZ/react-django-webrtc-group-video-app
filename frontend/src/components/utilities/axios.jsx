import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("access_token"),
  },
});

const getRoomsList = (axiosInstance) => {
  delete axiosInstance.defaults.headers["Authorization"];
  return axiosInstance.get("events/");
};

const validateToken = (axiosInstance, token) => {
  return axiosInstance.post("token/verify/", {
    token: token,
  });
};

const refreshingAccessToken = () => {
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
            this.printFeedback({ type: "error", feedbackMsg: err.message });
          });
      }
    });
};

export { getRoomsList, validateToken, refreshingAccessToken };
export default axiosInstance;
