
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Client, ClientCreate } from '@/types/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useClients = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  const {
    data: clients,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      if (!user) return [] as Client[];
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('driver_id', user.id)
        .order('last_name', { ascending: true });

      if (error) {
        console.error('Error fetching clients', error);
        throw error;
      }

      return data as Client[];
    },
    enabled: !!user, // Only run query if user exists
  });

  const addClient = useMutation({
    mutationFn: async (newClient: Omit<ClientCreate, "driver_id">) => {
      // Get the current user's ID from auth
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Add the driver_id to the client data
      const clientWithDriverId = {
        ...newClient,
        driver_id: user.id,
        full_name: `${newClient.first_name} ${newClient.last_name}`
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

      return data as Client;
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
      // Auto-update full_name if first_name or last_name changes
      if (client.first_name || client.last_name) {
        const existingClient = clients?.find(c => c.id === client.id);
        if (existingClient) {
          client.full_name = `${client.first_name || existingClient.first_name} ${client.last_name || existingClient.last_name}`;
        }
      }

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

  return {
    clients: clients || [],
    isLoading,
    error: error ? (error as Error).message : null,
    addClient,
    updateClient,
    refetch,
  };
};
