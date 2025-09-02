
'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  email: string;
  role: 'student' | 'admin';
  name?: string;
};

// This is a mock user database. In a real app, this would be a backend service.
const MOCK_USERS: { [key: string]: User } = {
  'user@test.com': { id: '1', email: 'user@test.com', role: 'student', name: 'Test User' },
  'admin@hyhan.vn': { id: '2', email: 'admin@hyhan.vn', role: 'admin', name: 'Admin User' },
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  register: (email: string, pass: string, name: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for a logged-in user
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock API call
        const foundUser = Object.values(MOCK_USERS).find(u => u.email === email);
        // NOTE: In a real app, you'd check the password hash. Here we ignore it.
        if (foundUser) {
          localStorage.setItem('user', JSON.stringify(foundUser));
          setUser(foundUser);
          resolve(foundUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  }, []);

  const register = useCallback(async (email: string, pass: string, name: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock API call
        if (MOCK_USERS[email]) {
          reject(new Error('User already exists'));
        } else {
          const newUser: User = {
            id: String(Object.keys(MOCK_USERS).length + 1),
            email,
            name,
            role: email === 'admin@hyhan.vn' ? 'admin' : 'student',
          };
          MOCK_USERS[email] = newUser;
          // Don't log in automatically after registration.
          // localStorage.setItem('user', JSON.stringify(newUser));
          // setUser(newUser);
          resolve(newUser);
        }
      }, 500);
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  }, [router]);
  
  const value = { user, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
