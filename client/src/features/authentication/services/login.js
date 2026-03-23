<<<<<<< HEAD
export const loginUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        resolve({ access_token: "demo-token" });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 500);
  });
=======
import axios from "axios";

const API = import.meta.env.VITE_BASE_URL;

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API}/login`, {
    email: email.toLowerCase(),
    password,
  });

  return response.data;
>>>>>>> origin/main-group-C
};