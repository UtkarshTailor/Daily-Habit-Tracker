import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const API_TOKEN_STORAGE_KEY = "api_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(API_TOKEN_STORAGE_KEY));

  const register = async (name, email, password) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      }
    );
    if (res.ok) {
      const data = await res.json()
      setToken(data.token);
      localStorage.setItem(API_TOKEN_STORAGE_KEY, data.token);
      return { success: true };
    }
    return { success: false, message: "Error occurred" };
  };

  const login = async (email, password) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      }
    );
    if (res.ok) {
      const data = await res.json()
      setToken(data.token);
      localStorage.setItem(API_TOKEN_STORAGE_KEY, data.token);
      return { success: true };
    }
    return { success: false, message: "Invalid credentials" };
  };

  const logout = async () => {
    setToken(null);
    localStorage.removeItem(API_TOKEN_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
