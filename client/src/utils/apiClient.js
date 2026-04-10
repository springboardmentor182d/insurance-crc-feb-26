import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://13.61.5.205:8000",
  headers: {
    "Content-Type": "application/json"
  }
});

export default apiClient;