
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Car, CreditCard, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.first_name || 'Chauffeur';
  
  const setupCards = [
    {
      title: "Configurer vos véhicules",
      description: "Ajoutez les véhicules que vous proposez à vos clients",
      icon: Car,
      href: "/dashboard/vehicles",
      color: "bg-blue-500"
    },
    {
      title: "Définir vos tarifs",
      description: "Configurez les prix pour chaque véhicule et type de service",
      icon: CreditCard,
      href: "/dashboard/pricing",
      color: "bg-green-500"
    },
    {
      title: "Personnaliser vos devis",
      description: "Ajoutez votre logo et personnalisez l'apparence de vos devis",
      icon: Settings,
      href: "/dashboard/settings",
      color: "bg-purple-500"
    }
  ];
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bienvenue, {firstName}</h1>
          <p className="text-muted-foreground">
            Commencez à configurer votre compte pour offrir des devis personnalisés à vos clients.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {setupCards.map((card, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className={`rounded-lg p-2 ${card.color}`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{card.description}</CardDescription>
                <Button asChild>
                  <Link to={card.href}>Configurer</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Votre période d'essai</CardTitle>
            <CardDescription>
              Vous bénéficiez de 14 jours pour tester toutes les fonctionnalités de VTCZen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Progression</span>
                  <span className="font-medium">7 jours restants</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-1/2 rounded-full bg-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Pendant cette période d'essai, toutes les fonctionnalités sont débloquées.
                Certaines informations comme les coordonnées de société seront remplacées par celles de MENESGUEN SERVICES dans les devis générés.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
