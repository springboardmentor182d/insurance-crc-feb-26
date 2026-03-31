import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// ================= LOGIN =================
export const loginUser = async (email, password) => {
  const response = await axios.post(`${API}/login`, {
    email,
    password,
  });
  return response.data;
};

// ================= SIGNUP =================
export const signupUser = async (name, email, password) => {
  const response = await axios.post(`${API}/signup`, {
    name,
    email,
    password,
  });
  return response.data;
};