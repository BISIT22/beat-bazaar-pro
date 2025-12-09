import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { initialUsers } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  users: User[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateUserWallet: (userId: string, rubDelta: number, usdDelta: number) => void;
  getUserById: (id: string) => User | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'beatmarket_users';
const CURRENT_USER_KEY = 'beatmarket_current_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setItemSafe = (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to persist ${key}`, error);
    }
  };

  // Initialize users from localStorage or defaults
  useEffect(() => {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    const storedCurrentUser = localStorage.getItem(CURRENT_USER_KEY);
    
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      setUsers(parsedUsers);
      
      if (storedCurrentUser) {
        const currentUserId = JSON.parse(storedCurrentUser);
        const foundUser = parsedUsers.find((u: User) => u.id === currentUserId);
        if (foundUser) {
          setUser(foundUser);
        }
      }
    } else {
      setUsers(initialUsers);
      setItemSafe(USERS_STORAGE_KEY, initialUsers);
    }
    
    setIsLoading(false);
  }, []);

  // Sync users to localStorage
  useEffect(() => {
    if (users.length > 0) {
      setItemSafe(USERS_STORAGE_KEY, users);
    }
  }, [users]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      setItemSafe(CURRENT_USER_KEY, foundUser.id);
      return { success: true };
    }
    
    return { success: false, error: 'Неверный email или пароль' };
  };

  const register = async (email: string, password: string, name: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      return { success: false, error: 'Пользователь с таким email уже существует' };
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password,
      role,
      name,
      avatar: '',
      bio: '',
      walletRub: role === 'buyer' ? 10000 : 0,
      walletUsd: role === 'buyer' ? 100 : 0,
      createdAt: new Date().toISOString(),
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setUser(newUser);
    setItemSafe(CURRENT_USER_KEY, newUser.id);
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    setUsers(updatedUsers);
  };

  const updateUserWallet = (userId: string, rubDelta: number, usdDelta: number) => {
    setUsers(prevUsers => {
      const nextUsers = prevUsers.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            walletRub: u.walletRub + rubDelta,
            walletUsd: u.walletUsd + usdDelta,
          };
        }
        return u;
      });

      setItemSafe(USERS_STORAGE_KEY, nextUsers);

      if (user && user.id === userId) {
        const updated = nextUsers.find(u => u.id === userId);
        if (updated) {
          setUser(updated);
        }
      }

      return nextUsers;
    });
  };

  const getUserById = (id: string) => users.find(u => u.id === id);

  return (
    <AuthContext.Provider value={{
      user,
      users,
      isLoading,
      login,
      register,
      logout,
      updateUser,
      updateUserWallet,
      getUserById,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
