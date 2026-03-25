import axios from "axios";

const baseURL = (process.env.REACT_APP_BASE_URL || "http://127.0.0.1:8000").trim();

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
