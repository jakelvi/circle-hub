import axios from "axios";

export function orderDesc(field: string) {
  return { $orderBy: `-${field}` };
}

export interface QueryOptions {
  $orderBy?: string;
  $limit?: number;
}

export function handleTokenAfterLogin(token: string) {
  localStorage.setItem("accessToken", token);

  const decodedToken = decodeToken(token);
  const { username } = decodedToken;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return { token, username };
}

function decodeToken(token: string) {
  try {
    if (!token) {
      throw new Error("Token is undefined");
    }
    const parts = token.split(".");
    const decodedPayload = JSON.parse(atob(parts[1]));
    return decodedPayload;
  } catch (error) {
    console.error("Error decoding token:", error);
    throw error;
  }
}

export const clearLocalStorage = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("authState");
};
