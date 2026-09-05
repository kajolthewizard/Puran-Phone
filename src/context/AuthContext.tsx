import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: 'customer' | 'seller' | 'admin') => void;
  signup: (name: string, email: string, phone: string, role?: 'customer' | 'seller') => void;
  logout: () => void;
  switchRole: (role: 'customer' | 'seller' | 'admin') => void;
}

const AUTH_STORAGE_KEY = 'rephone_auth_user_v1';

const DEFAULT_DEMO_USERS: Record<'customer' | 'seller' | 'admin', User> = {
  customer: {
    id: 'usr-dhaka-88',
    name: 'Rafiqul Islam',
    email: 'rafiqul@puranphone.com',
    phone: '+880 1712-345678',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    savedAddresses: [
      {
        fullName: 'Rafiqul Islam',
        phone: '+880 1712-345678',
        division: 'Dhaka',
        city: 'Dhaka',
        area: 'Banani',
        addressLine: 'House 42, Road 11, Block D',
        isDefault: true,
      },
      {
        fullName: 'Rafiqul Islam (Office)',
        phone: '+880 1712-345678',
        division: 'Dhaka',
        city: 'Dhaka',
        area: 'Gulshan 1',
        addressLine: 'Avenue Tower, Level 8',
        isDefault: false,
      },
    ],
  },
  seller: {
    id: 'sel-dhaka-1',
    name: 'Apex Refurb Hub (Kamal Hossain)',
    email: 'apex.refurb@puranphone.com',
    phone: '+880 1819-876543',
    role: 'seller',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    savedAddresses: [
      {
        fullName: 'Apex Refurb Hub',
        phone: '+880 1819-876543',
        division: 'Dhaka',
        city: 'Dhaka',
        area: 'Hatirpool',
        addressLine: 'Shop 412, Level 4, Motaleb Plaza',
        isDefault: true,
      },
    ],
  },
  admin: {
    id: 'adm-ops-01',
    name: 'Tariq Munir (RE:PHONE Ops Lead)',
    email: 'admin@puranphone.com',
    phone: '+880 1911-000111',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    savedAddresses: [
      {
        fullName: 'RE:PHONE HQ Inspection Center',
        phone: '+880 1911-000111',
        division: 'Dhaka',
        city: 'Dhaka',
        area: 'Tejgaon Industrial Area',
        addressLine: 'Plot 18, Road 4, Circular Tech Hub',
        isDefault: true,
      },
    ],
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_USERS.customer;
    } catch {
      return DEFAULT_DEMO_USERS.customer;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = (email: string, role: 'customer' | 'seller' | 'admin' = 'customer') => {
    const demo = DEFAULT_DEMO_USERS[role];
    setUser({
      ...demo,
      email: email || demo.email,
    });
  };

  const signup = (
    name: string,
    email: string,
    phone: string,
    role: 'customer' | 'seller' = 'customer'
  ) => {
    const newUser: User = {
      id: `usr-${Date.now().toString(36)}`,
      name,
      email,
      phone,
      role,
      savedAddresses: [
        {
          fullName: name,
          phone,
          division: 'Dhaka',
          city: 'Dhaka',
          area: 'Dhanmondi',
          addressLine: 'Standard Delivery Address',
          isDefault: true,
        },
      ],
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: 'customer' | 'seller' | 'admin') => {
    setUser(DEFAULT_DEMO_USERS[role]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
