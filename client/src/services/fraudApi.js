const BASE_URL = "http://localhost:8000/fraud";

export const getFraudStats = async () => {
  const response = await fetch(`${BASE_URL}/stats`);
  return response.json();
};

export const getFraudFlags = async () => {
  const response = await fetch(`${BASE_URL}/flags`);
  return response.json();
};

export const updateFraudStatus = async (id, status) => {
  const response = await fetch(`${BASE_URL}/update-status/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return response.json();
};