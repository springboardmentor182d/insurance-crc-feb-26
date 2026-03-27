export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const response = await fetch(
    `http://127.0.0.1:8000/api/refresh?token=${encodeURIComponent(refreshToken)}`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Refresh token failed");
  }

  localStorage.setItem("access_token", data.access_token);

  return data.access_token;
}