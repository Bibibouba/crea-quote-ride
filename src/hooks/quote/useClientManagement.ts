
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useClientManagement = () => {
  const { toast } = useToast();

  const createNewClient = async (
    driverId: string,
    firstName: string,
    lastName: string,
    email?: string,
    phone?: string
  ) => {
    console.log("Creating new client with driver_id:", driverId);
    
    const { data, error } = await supabase
      .from('clients')
      .insert({
        driver_id: driverId,
        first_name: firstName,
        last_name: lastName,
        email: email || '',
        phone: phone || '',
        client_type: 'personal'
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating client:", error);
      throw error;
    }
    
    console.log("Created new client:", data);
    
    toast({
      title: 'Client créé',
      description: `${firstName} ${lastName} a été ajouté à votre liste de clients`,
    });
    
    return data.id;
  };

  return { createNewClient };
};
