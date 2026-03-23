import axios from "axios";

const API = import.meta.env.VITE_BASE_URL;

export const signupUser = async (name, email, password, phone, address, dob) => {
  const response = await axios.post(`${API}/auth/signup`, {
    name,
    email: email.toLowerCase(),
    password,
    phone,
    address,
    dob
  });

  return response.data;
};