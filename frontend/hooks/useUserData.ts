import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useUserData = () => {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  return { userData, loading };
};