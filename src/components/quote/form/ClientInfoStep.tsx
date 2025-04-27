
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';

interface ClientInfoStepProps {
  firstName: string;
  setFirstName: (firstName: string) => void;
  lastName: string;
  setLastName: (lastName: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handlePreviousStep: () => void;
  isWidget?: boolean;
}

const ClientInfoStep: React.FC<ClientInfoStepProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  isSubmitting,
  handleSubmit,
  handlePreviousStep,
  isWidget = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={isWidget ? "text-widget-primary" : ""}>
          Vos informations
        </CardTitle>
        <CardDescription>
          Veuillez saisir vos coordonnées pour recevoir votre devis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Votre prénom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Votre nom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre.email@exemple.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06 12 34 56 78"
              />
            </div>
          </div>
          
          {isWidget && (
            <div className="text-xs text-muted-foreground mt-2">
              * En soumettant ce formulaire, vous acceptez que vos données soient traitées pour le traitement de votre demande de devis.
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePreviousStep}
              className="order-2 sm:order-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Étape précédente
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className={`order-1 sm:order-2 sm:flex-1 ${isWidget ? "bg-widget-primary-color hover:bg-widget-primary-color/90" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : "Envoyer ma demande de devis"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClientInfoStep;
