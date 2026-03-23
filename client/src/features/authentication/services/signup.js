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
};