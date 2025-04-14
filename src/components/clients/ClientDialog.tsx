
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
import { PlusCircle, Edit } from 'lucide-react';
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

  const isEditMode = !!initialData?.id;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant}>
          {isEditMode ? (
            <Edit className="h-4 w-4" />
          ) : (
            <PlusCircle className="mr-2 h-4 w-4" />
          )}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Modifier le client' : 'Ajouter un nouveau client'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
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
