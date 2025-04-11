
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useClients } from '@/hooks/useClients';

export function useQuoteClient(clientId?: string) {
  const { user } = useAuth();
  const { clients } = useClients();
  
  const [selectedClient, setSelectedClient] = useState(clientId || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  // Load client information if clientId is provided
  useEffect(() => {
    if (clientId && clients.length > 0) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        setFirstName(client.first_name);
        setLastName(client.last_name);
        setEmail(client.email);
      }
    }
  }, [clientId, clients]);
  
  // Load user information if no clientId is provided
  useEffect(() => {
    if (user && !clientId) {
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
  }, [user, clientId]);

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    selectedClient
  };
}
