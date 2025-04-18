
import { supabase } from '@/integrations/supabase/client';

export const useSessionManager = () => {
  const getAuthenticatedUserId = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      throw new Error("Utilisateur non authentifié");
    }
    
    return userId;
  };

  return { getAuthenticatedUserId };
};
