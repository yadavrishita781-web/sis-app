import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { DUMMY_USERS, DUMMY_CREDENTIALS } from '../services/dummyData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('sis_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, password: string): boolean => {
    const validPassword = DUMMY_CREDENTIALS[email];
    if (!validPassword || validPassword !== password) return false;
    const found = DUMMY_USERS.find(u => u.email === email);
    if (!found) return false;
    setUser(found);
    localStorage.setItem('sis_user', JSON.stringify(found));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sis_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
