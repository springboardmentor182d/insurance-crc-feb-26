import axios from "axios";

const API = import.meta.env.VITE_BASE_URL;

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API}/login`, {
    email: email.toLowerCase(),
    password,
  });

  return response.data;
};

export const signupUser = async (name, email, password) => {
  const response = await axios.post(`${API}/signup`, {
    name,
    email: email.toLowerCase(),
    password,
  });

  return response.data;
};