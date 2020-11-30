import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/";

const checkTokenValidity = (axiosInstance, token) => {
  axiosInstance
    .post("token/verify/", {
      token: token,
    })
    .then((response) => {
      console.log(response.status);
      if (response.status === 200) {
        return true;
      }
    })
    .catch((error) => {
      console.log(error.response.data);
      return false;
    });
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

const access_token = localStorage.getItem("access_token");
const refresh_token = localStorage.getItem("refresh_token");
if (
  checkTokenValidity(axiosInstance, refresh_token) &&
  checkTokenValidity(axiosInstance, access_token)
) {
  axiosInstance.defaults.headers["Authorization"] = "Bearer " + access_token;
}

export { checkTokenValidity };
export default axiosInstance;
