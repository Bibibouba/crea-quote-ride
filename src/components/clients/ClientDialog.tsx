
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import ClientForm from './ClientForm';
import { Client } from '@/types/client';

interface ClientDialogProps {
  onClientAdded?: () => void;
  initialData?: Partial<Client>;
  buttonText?: string;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const ClientDialog: React.FC<ClientDialogProps> = ({
  onClientAdded,
  initialData,
  buttonText = 'Ajouter un client',
  buttonVariant = 'default',
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onClientAdded) onClientAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? 'Modifier le client' : 'Ajouter un nouveau client'}
          </DialogTitle>
          <DialogDescription>
            {initialData?.id
              ? 'Modifiez les informations du client ci-dessous.'
              : 'Remplissez le formulaire pour ajouter un nouveau client.'}
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClientDialog;
