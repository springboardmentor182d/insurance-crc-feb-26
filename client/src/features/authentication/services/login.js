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
};