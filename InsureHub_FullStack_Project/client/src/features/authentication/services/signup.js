import axios from "axios";
import { API_BASE_URL } from "../../../data/constants";

export async function signupUser(payload) {
  const response = await axios.post(`${API_BASE_URL}/auth/signup`, payload);
  return response.data;
}
