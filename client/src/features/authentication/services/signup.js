<<<<<<< HEAD
export const signupUser = async (name, email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name && email && password) {
        resolve({ message: "Signup successful" });
      } else {
        reject(new Error("Signup failed"));
      }
    }, 500);
  });
=======
import axios from "axios";

const API = import.meta.env.VITE_BASE_URL;

export const signupUser = async (name, email, password) => {
  const response = await axios.post(`${API}/signup`, {
    name,
    email: email.toLowerCase(),
    password,
  });

  return response.data;
>>>>>>> origin/main-group-C
};