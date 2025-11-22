import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("demo_user");
    return saved ? JSON.parse(saved) : null;
  });

  // demo credentials
  const DEMO_EMAIL = "demo@demo.com";
  const DEMO_PASSWORD = "123456";

  const login = (email, password) => {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const userData = { email };
      setUser(userData);
      localStorage.setItem("demo_user", JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: "Invalid credentials" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("demo_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
