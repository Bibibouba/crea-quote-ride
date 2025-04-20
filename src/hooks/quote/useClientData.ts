
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useClients } from '@/hooks/useClients';

interface UseClientDataProps {
  clientId?: string;
}

export const useClientData = ({ clientId }: UseClientDataProps = {}) => {
  // Always initialize state variables first, before any conditional logic
  const [selectedClient, setSelectedClient] = useState(clientId || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Then use other hooks
  const { clients } = useClients();
  
  // Load client data if clientId is provided
  useEffect(() => {
    if (clientId && clients.length > 0) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        setSelectedClient(client.id);
        setFirstName(client.first_name);
        setLastName(client.last_name);
        setEmail(client.email);
        setPhone(client.phone || '');
      }
    }
  }, [clientId, clients]);
  
  // Load user data if no clientId is provided
  useEffect(() => {
    if (!clientId) {
      const fetchUserInfo = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) return;
          
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
            setPhone('');
          }
        } catch (error) {
          console.error('Erreur lors du chargement des informations utilisateur:', error);
        }
      };
      
      fetchUserInfo();
    }
  }, [clientId]);
  
  return {
    selectedClient,
    setSelectedClient,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone
  };
};
