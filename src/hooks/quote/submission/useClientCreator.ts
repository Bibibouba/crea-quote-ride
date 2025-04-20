
import { useClientManagement } from '../useClientManagement';

interface CreateClientProps {
  driverId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  selectedClient?: string;
}

export const useClientCreator = () => {
  const { createNewClient } = useClientManagement();

  const ensureClientExists = async ({
    driverId,
    firstName,
    lastName,
    email,
    phone,
    selectedClient
  }: CreateClientProps): Promise<string> => {
    let finalClientId = selectedClient;
    
    if ((!selectedClient || selectedClient === '') && firstName && lastName) {
      finalClientId = await createNewClient(driverId, firstName, lastName, email, phone);
    }
    
    if (!finalClientId) {
      throw new Error("Aucun client spécifié pour ce devis");
    }
    
    return finalClientId;
  };

  return { ensureClientExists };
};
