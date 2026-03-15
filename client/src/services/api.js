
import axios from "axios";
import { clearAuthToken, getAuthToken } from "../utils/auth";

const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";
const API = axios.create({ baseURL: API_BASE_URL });

API.interceptors.request.use((config) => {
	const token = getAuthToken();

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

API.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error?.response?.status === 401) {
			clearAuthToken();
		}

		return Promise.reject(error);
	}
);

export default API;
