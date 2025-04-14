
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Client, ClientCreate } from '@/types/client';
import { useToast } from '@/hooks/use-toast';

export const useClients = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: clients,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        
        if (!userId) {
          console.error('No user session found');
          throw new Error('User not authenticated');
        }
        
        console.log('Fetching clients for driver:', userId);
        
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('driver_id', userId)
          .order('last_name', { ascending: true });

        if (error) {
          console.error('Error fetching clients', error);
          throw error;
        }

        console.log(`Fetched ${data?.length || 0} clients for driver ${userId}`);
        return data as Client[];
      } catch (error) {
        console.error('Error in useClients query:', error);
        throw error;
      }
    }
  });

  const addClient = useMutation({
    mutationFn: async (newClient: Omit<ClientCreate, "driver_id">) => {
      try {
        // Get the current user's ID from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        
        if (!userId) {
          console.error('No user session found');
          throw new Error("User not authenticated");
        }
        
        console.log('Creating client with driver_id:', userId);
        
        // Add the driver_id to the client data
        const clientWithDriverId = {
          ...newClient,
          driver_id: userId
        };

        const { data, error } = await supabase
          .from('clients')
          .insert(clientWithDriverId)
          .select()
          .single();

        if (error) {
          console.error('Error adding client', error);
          throw error;
        }

        console.log('Client created successfully:', data);
        return data as Client;
      } catch (error) {
        console.error('Error in addClient mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: 'Client ajouté',
        description: 'Le client a été ajouté avec succès',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: `Erreur lors de l'ajout du client: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const updateClient = useMutation({
    mutationFn: async (client: Partial<Client> & { id: string }) => {
      const { data, error } = await supabase
        .from('clients')
        .update(client)
        .eq('id', client.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating client', error);
        throw error;
      }

      return data as Client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: 'Client mis à jour',
        description: 'Le client a été mis à jour avec succès',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: `Erreur lors de la mise à jour du client: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  const deleteClient = useMutation({
    mutationFn: async (clientId: string) => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) {
        console.error('Error deleting client', error);
        throw error;
      }

      return clientId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: `Erreur lors de la suppression du client: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    clients: clients || [],
    isLoading,
    error: error ? (error as Error).message : null,
    addClient,
    updateClient,
    deleteClient,
    refetch,
  };
};
