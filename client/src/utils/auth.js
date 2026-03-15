const TOKEN_KEY = "token";

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const parseJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }

    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const isTokenValid = (token) => {
  if (!token) {
    return false;
  }

  const payload = parseJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") {
    return false;
  }

  const currentEpoch = Math.floor(Date.now() / 1000);
  return payload.exp > currentEpoch;
};

export const isAuthenticated = () => {
  const token = getAuthToken();

  if (!isTokenValid(token)) {
    clearAuthToken();
    return false;
  }

  return true;
};
