import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "patient" | "doctor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  specialization?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<string, User> = {
  "patient@demo.com": {
    id: "p1",
    name: "Sarah Johnson",
    email: "patient@demo.com",
    role: "patient",
  },
  "doctor@demo.com": {
    id: "d1",
    name: "Dr. James Wilson",
    email: "doctor@demo.com",
    role: "doctor",
    specialization: "Cardiology",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string, role: UserRole): boolean => {
    const mockUser = MOCK_USERS[email];
    if (mockUser && mockUser.role === role) {
      setUser(mockUser);
      return true;
    }
    // Allow any login for demo
    setUser({
      id: role === "patient" ? "p-new" : "d-new",
      name: role === "patient" ? "Demo Patient" : "Dr. Demo",
      email,
      role,
      specialization: role === "doctor" ? "General Medicine" : undefined,
    });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
