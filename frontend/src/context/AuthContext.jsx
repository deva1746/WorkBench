import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /** Load user profile if a token exists in localStorage. */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login/json", { email, password });
    localStorage.setItem("token", res.data.access_token);
    const userRes = await api.get("/auth/me");
    setUser(userRes.data);
    return userRes.data;
  };

  const register = async (fullName, email, password) => {
    await api.post("/users/register", {
      full_name: fullName,
      email,
      password,
    });
    return login(email, password);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Token may already be invalid; still clear local state.
    }
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
