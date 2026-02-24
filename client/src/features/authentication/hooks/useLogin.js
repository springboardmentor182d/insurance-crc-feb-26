import { loginAPI } from "../services/login";

export default function useLogin() {
  const login = async (email, password) => {
    try {
      const data = await loginAPI(email, password);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return login;
}