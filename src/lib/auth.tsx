import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

type User = { id: string; name: string; email: string } | null;

type AuthContextValue = {
  user: User;
  loading: boolean;
  accessToken?: string | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("km_token") : null;
      if (token) {
        api.setToken(token);
        try {
          const res = await api.get("/users/profile");
          setUser(res.data ?? null);
          setAccessToken(token);
        } catch (e) {
          api.setToken(null);
          setUser(null);
          setAccessToken(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    const res = await api.post("/auth/login", data);
    const token = res.data?.accessToken;
    if (!token) throw new Error(res.message || "Missing token");
    api.setToken(token);
    setAccessToken(token);
    const profile = res.data.user ?? (await api.get("/users/profile")).data;
    setUser(profile);
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    const res = await api.post("/auth/register", data);
    // auto-login after register
    await login({ email: data.email, password: data.password });
    return res;
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, accessToken, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export default AuthProvider;
