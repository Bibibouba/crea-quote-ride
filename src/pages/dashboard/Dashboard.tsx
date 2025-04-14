
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Car, CreditCard, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const Dashboard = () => {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.first_name || 'Chauffeur';
  const [trialDaysRemaining, setTrialDaysRemaining] = useState<number>(0);
  const [trialProgressPercent, setTrialProgressPercent] = useState<number>(0);
  const [signupDate, setSignupDate] = useState<Date | null>(null);
  
  useEffect(() => {
    const fetchUserSignupDate = async () => {
      if (!user) return;
      
      try {
        // Get the user's created_at date from auth.users through the user object
        const createdAt = user.created_at;
        
        if (createdAt) {
          const signupDate = new Date(createdAt);
          setSignupDate(signupDate);
          
          // Calculate days since signup
          const currentDate = new Date();
          const trialLengthDays = 14;
          const daysSinceSignup = Math.floor((currentDate.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // Calculate remaining days (not going below 0)
          const remaining = Math.max(0, trialLengthDays - daysSinceSignup);
          setTrialDaysRemaining(remaining);
          
          // Calculate progress percentage
          const progressPercent = Math.min(100, Math.round((daysSinceSignup / trialLengthDays) * 100));
          setTrialProgressPercent(progressPercent);
        }
      } catch (error) {
        console.error('Error fetching user signup date:', error);
      }
    };
    
    fetchUserSignupDate();
  }, [user]);
  
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
  
  // Format how long ago the user signed up
  const formatSignupTimeAgo = () => {
    if (!signupDate) return '';
    return formatDistanceToNow(signupDate, { addSuffix: true, locale: fr });
  };
  
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
                  <span className="font-medium">{trialDaysRemaining} {trialDaysRemaining > 1 ? 'jours' : 'jour'} restants</span>
                </div>
                <Progress className="h-2" value={trialProgressPercent} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">
                  Pendant cette période d'essai, toutes les fonctionnalités sont débloquées.
                  Certaines informations comme les coordonnées de société seront remplacées par celles de MENESGUEN SERVICES dans les devis générés.
                </p>
                {signupDate && (
                  <p className="text-xs text-muted-foreground">
                    Inscrit {formatSignupTimeAgo()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
