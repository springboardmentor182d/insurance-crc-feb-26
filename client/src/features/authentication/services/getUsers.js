const baseURL = process.env.REACT_APP_BASE_URL;

export const getUsers = async () => {
  try {

    const response = await fetch(`${baseURL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    return data;

  } catch (error) {
    console.error("Error fetching users:", error);
  }
};