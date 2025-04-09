
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client';
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
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('last_name', { ascending: true });

      if (error) {
        console.error('Error fetching clients', error);
        throw error;
      }

      return data as Client[];
    }
  });

  const addClient = useMutation({
    mutationFn: async (newClient: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'driver_id'>) => {
      const { data, error } = await supabase
        .from('clients')
        .insert(newClient)
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
