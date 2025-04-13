
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from './ClientFormSchema';

interface ClientFormFooterProps {
  form: UseFormReturn<ClientFormValues>;
}

const ClientFormFooter: React.FC<ClientFormFooterProps> = ({ form }) => {
  // This component can be used for any additional fields or features
  // that should appear at the bottom of all client form types
  return null;
};

export default ClientFormFooter;
