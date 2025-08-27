import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  email: string;
  name?: string;
  familyGroupId?: string;
}

interface FamilyGroup {
  id: string;
  name: string;
  ownerEmail: string;
  inviteCode: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [familyGroup, setFamilyGroup] = useState<FamilyGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedEmail = localStorage.getItem('userEmail');
      if (savedEmail) {
        const response = await apiRequest('GET', `/api/users/email/${savedEmail}`);
        const userData = await response.json();
        setUser(userData);
        
        if (userData.familyGroupId) {
          const groupResponse = await apiRequest('GET', `/api/family-groups/${userData.familyGroupId}`);
          const groupData = await groupResponse.json();
          setFamilyGroup(groupData);
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    familyGroup,
    isLoading,
    refreshUser: loadUser
  };
}