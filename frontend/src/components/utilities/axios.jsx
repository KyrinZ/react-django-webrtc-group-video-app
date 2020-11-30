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

export { getRoomsList, validateToken };
export default axiosInstance;
