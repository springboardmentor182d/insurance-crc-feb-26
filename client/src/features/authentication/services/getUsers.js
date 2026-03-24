import axios from "axios";
import { API_BASE_URL } from "../../../data/constants";

export async function getMe(token) {
  const response = await axios.get(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
