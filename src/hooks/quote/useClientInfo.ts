
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useClientInfo() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    if (user) {
      const fetchUserInfo = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            setFirstName(data.first_name || '');
            setLastName(data.last_name || '');
            setEmail(data.email || user.email || '');
          }
        } catch (error) {
          console.error('Erreur lors du chargement des informations utilisateur:', error);
        }
      };
      
      fetchUserInfo();
    }
  }, [user]);
  
  const validateClientInfo = (): boolean => {
    return !!(firstName && lastName && email && email.includes('@'));
  };

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    validateClientInfo
  };
}
