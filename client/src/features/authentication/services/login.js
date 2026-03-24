import axios from "axios";
import { API_BASE_URL } from "../../../data/constants";

export async function loginUser(payload) {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, payload);
  return response.data;
}
