
import { useState } from 'react';
import { useClientManagement } from './useClientManagement';
import { useSessionManager } from './useSessionManager';

export const useQuoteClientHandler = () => {
  const { createNewClient } = useClientManagement();
  const { getAuthenticatedUserId } = useSessionManager();
  
  const handleClientCreation = async (
    firstName?: string,
    lastName?: string,
    email?: string,
    phone?: string,
    selectedClient?: string
  ) => {
    const driverId = await getAuthenticatedUserId();
    let finalClientId = selectedClient;
    
    if ((!selectedClient || selectedClient === '') && firstName && lastName) {
      finalClientId = await createNewClient(driverId, firstName, lastName, email, phone);
    }
    
    if (!finalClientId) {
      throw new Error("Aucun client spécifié pour ce devis");
    }
    
    return { driverId, clientId: finalClientId };
  };
  
  return { handleClientCreation };
};
