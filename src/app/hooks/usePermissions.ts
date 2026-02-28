import { useEffect, useState } from 'react';
import { getCurrentUserRole, UserRole } from '../services/permissions';
import { auth } from '@/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const usePermissions = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await getCurrentUserRole();
        setUserRole(role);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    userRole,
    loading,
    isAdmin: userRole === UserRole.ADMIN,
    isPresident: userRole === UserRole.PRESIDENT,
    isLecturer: userRole === UserRole.LECTURER,
    isDirector: userRole === UserRole.DIRECTOR
  };
};