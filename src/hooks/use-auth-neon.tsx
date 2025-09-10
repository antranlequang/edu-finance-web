'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/lib/database-operations';

type User = UserProfile;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string, dateOfBirth?: Date, gender?: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      setUser(data.user);
      return data.user;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (
    email: string, 
    password: string, 
    name: string, 
    dateOfBirth?: Date, 
    gender?: string
  ): Promise<User> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, dateOfBirth, gender }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      const data = await response.json();
      return data.user;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // Clear user-specific data from localStorage
      const currentUserId = user?.id;
      if (currentUserId) {
        // Clear chat history for this user
        localStorage.removeItem(`chatHistory_${currentUserId}`);
        localStorage.removeItem('chatHistory'); // Clear generic chat history too
        
        // Clear EduScore data
        localStorage.removeItem('eduscoreData');
        localStorage.removeItem('surveyData');
        localStorage.removeItem('eduscoreResult');
        
        // Clear any other user-specific session data
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(`chatHistory_${currentUserId}`) || 
              key.startsWith('chatSessions') || 
              key.startsWith('currentSessionId')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [router, user?.id]);
  
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