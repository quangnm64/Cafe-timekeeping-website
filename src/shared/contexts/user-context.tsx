'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export type User = {
  employeeId: string;
  fullName: string;
  gender: string;
  dateOfBirth: Date;
  phone?: string;
  email?: string;
  address?: string;
  storeId: string;
  positionId: string;
  hireDate: Date;
  status: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  refetch: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchUser = useCallback(async () => {
    fetch('/api/getToken', { method: 'POST' })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Request failed');
        }
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, loading, refetch: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used inside UserProvider');
  }
  return ctx;
}
