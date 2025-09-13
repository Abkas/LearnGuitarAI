import { axiosInstance } from "../lib/axios";

// Signup: POST /signup
export async function signup({ username, email, password }) {
  try {
    const response = await axiosInstance.post("/signup", {
      username,
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Signup failed");
  }
}

// Login: POST /login
export async function login({ email, password }) {
  try {
    const response = await axiosInstance.post("/login", {
      email,
      password
    });
    localStorage.setItem("access_token", response.data.access_token);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || error.message || "Login failed");
  }
}

// Logout: Remove token from localStorage
export function logout() {
  localStorage.removeItem("access_token");
}

// Check Authorization: Returns true if token exists
export function isAuthorized() {
  const token = localStorage.getItem("access_token");
  return !!token;
}

export async function checkTokenValid() {
  const token = localStorage.getItem("access_token");
  if (!token) return false;

  try {
    const response = await axiosInstance.get("/get-user", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch {
    return false;
  }
}