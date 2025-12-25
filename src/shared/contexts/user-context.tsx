'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export type User = {
  id: number;

  fullName: string;
  gender?: string;
  dateOfBirth: Date;

  taxCode?: string;

  bankName?: string;
  bankAccountNumber?: string;

  ethnicity?: string;
  religion?: string;

  citizenIdNumber?: string;
  citizenIdIssueDate?: Date;
  citizenIdIssuePlace?: string;

  educationLevel?: string;
  major?: string;
  university?: string;

  placeOfBirth?: string;
  hometown?: string;
  nationality: string;

  registeredAddress?: string;
  permanentAddress?: string;
  currentAddress?: string;

  avatarUrl?: string;

  hireDate: Date;
  fromDate?: Date;

  positionId: number;
  storeId: number;

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
