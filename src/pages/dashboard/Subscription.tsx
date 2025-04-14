
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Lock, Check, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Custom PayPal icon since it's not in Lucide
const PaypalLogo = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 8.5c0-2.5 2-4 4.5-4h4c2.5 0 4.5 1.5 4.5 4 0 2.5-1.5 4-4 4h-2l-1 6h-2l-1-6h-1c-2 0-3.5-1.5-3.5-4z" />
    <path d="M3.5 12.5c0-2.5 2-4 4.5-4h4c2.5 0 4.5 1.5 4.5 4 0 2.5-1.5 4-4 4h-2l-1 6h-2l-1-6h-1c-2 0-3.5-1.5-3.5-4z" />
  </svg>
);

// Stripe logo component
const StripeLogo = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4v16M4 8l16 8M4 16l16-8" />
  </svg>
);

const PricingFeature = ({ included, text }: { included: boolean; text: string }) => (
  <div className="flex items-center space-x-2">
    {included ? (
      <Check className="h-4 w-4 text-green-500" />
    ) : (
      <div className="h-4 w-4" />
    )}
    <span className="text-sm">{text}</span>
  </div>
);

type PlanInfo = {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: { included: boolean; text: string }[];
  additionalDriverInfo?: string;
};

const Subscription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'stripe'>('card');
  const [selectedPlanInfo, setSelectedPlanInfo] = useState<PlanInfo | null>(null);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pricing');
  
  // Parse the URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    const plan = searchParams.get('plan');
    
    if (tab === 'payment') {
      setActiveTab('payment');
      // Find the plan info based on the URL parameter
      if (plan) {
        const planInfo = plans.find(p => p.name.toLowerCase() === plan);
        if (planInfo) {
          setSelectedPlanInfo(planInfo);
        }
      }
    }
  }, [location]);

  const plans: PlanInfo[] = [
    {
      name: "Essentiel",
      monthlyPrice: 9.99,
      yearlyPrice: 9.99 * 12 * 0.8, // 20% discount
      description: "Idéal pour les chauffeurs individuels",
      features: [
        { included: true, text: "Jusqu'à 3 véhicules" },
        { included: true, text: "50 devis par mois" },
        { included: true, text: "Support email" },
        { included: false, text: "Personnalisation complète" },
        { included: false, text: "Facturation automatique" }
      ]
    },
    {
      name: "Professionnel",
      monthlyPrice: 19.99,
      yearlyPrice: 19.99 * 12 * 0.8, // 20% discount
      description: "Parfait pour les petites entreprises (2-9 chauffeurs)",
      features: [
        { included: true, text: "Jusqu'à 10 véhicules" },
        { included: true, text: "Devis illimités" },
        { included: true, text: "Support email et téléphone" },
        { included: true, text: "Personnalisation complète" },
        { included: false, text: "Facturation automatique" }
      ],
      additionalDriverInfo: "5€ HT par chauffeur supplémentaire"
    },
    {
      name: "Entreprise",
      monthlyPrice: 49.99,
      yearlyPrice: 49.99 * 12 * 0.8, // 20% discount
      description: "Adapté aux sociétés de transport (10+ chauffeurs)",
      features: [
        { included: true, text: "Véhicules illimités" },
        { included: true, text: "Devis illimités" },
        { included: true, text: "Support prioritaire 24/7" },
        { included: true, text: "Personnalisation complète" },
        { included: true, text: "Facturation automatique" }
      ],
      additionalDriverInfo: "5€ HT par chauffeur supplémentaire"
    }
  ];
  
  const handleSelectPlan = (plan: PlanInfo) => {
    setSelectedPlanInfo(plan);
    setActiveTab('payment');
    // Update the URL without page reload
    navigate(`/dashboard/subscription?tab=payment&plan=${plan.name.toLowerCase()}`, { replace: true });
  };
  
  const handlePayment = () => {
    // This would be replaced with actual payment handling logic
    toast({
      title: "Paiement",
      description: `Le paiement via ${paymentMethod} sera implémenté prochainement.`,
    });
  };
  
  const formattedPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',');
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Abonnement VTCZen</h1>
          <p className="text-muted-foreground">
            Choisissez votre plan et profitez de toutes les fonctionnalités de VTCZen.
          </p>
        </div>
        
        <Tabs defaultValue="pricing" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pricing">Plans</TabsTrigger>
            <TabsTrigger value="payment">Paiement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pricing" className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center bg-muted p-1 rounded-lg space-x-1">
                <Button
                  variant={selectedPlan === 'monthly' ? 'default' : 'ghost'}
                  className="rounded-md"
                  onClick={() => setSelectedPlan('monthly')}
                >
                  Mensuel
                </Button>
                <Button
                  variant={selectedPlan === 'yearly' ? 'default' : 'ghost'}
                  className="rounded-md"
                  onClick={() => setSelectedPlan('yearly')}
                >
                  Annuel <Badge className="ml-2 bg-green-600">-20%</Badge>
                </Button>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan, index) => (
                <Card key={index} className={index === 1 ? "border-2 border-primary relative overflow-hidden" : (index === 0 ? "border-primary" : "")}>
                  {index === 1 && (
                    <div className="absolute -right-12 top-7 rotate-45 bg-primary text-white text-xs py-1 px-12">
                      Populaire
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">
                        {formattedPrice(selectedPlan === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice)}€
                      </span>
                      <span className="text-muted-foreground">
                        {selectedPlan === 'monthly' ? '/mois' : '/an'}
                      </span>
                      <span className="block text-xs text-muted-foreground mt-1">HT</span>
                      
                      {plan.additionalDriverInfo && (
                        <span className="block text-xs text-muted-foreground mt-1">
                          {plan.additionalDriverInfo}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <PricingFeature key={i} included={feature.included} text={feature.text} />
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => handleSelectPlan(plan)}>
                      Choisir <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Méthode de paiement</CardTitle>
                <CardDescription>
                  Choisissez votre méthode de paiement préférée
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div 
                    className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                      paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-muted'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="bg-muted-foreground/10 p-2 rounded-full mr-4">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Carte bancaire</h3>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, Amex</p>
                    </div>
                    <div className="w-5 h-5 rounded-full border border-primary flex items-center justify-center">
                      {paymentMethod === 'card' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                    </div>
                  </div>
                  
                  <div 
                    className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                      paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-muted'
                    }`}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    <div className="bg-muted-foreground/10 p-2 rounded-full mr-4">
                      <PaypalLogo />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">PayPal</h3>
                      <p className="text-sm text-muted-foreground">Paiement sécurisé via PayPal</p>
                    </div>
                    <div className="w-5 h-5 rounded-full border border-primary flex items-center justify-center">
                      {paymentMethod === 'paypal' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                    </div>
                  </div>
                  
                  <div 
                    className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                      paymentMethod === 'stripe' ? 'border-primary bg-primary/5' : 'border-muted'
                    }`}
                    onClick={() => setPaymentMethod('stripe')}
                  >
                    <div className="bg-muted-foreground/10 p-2 rounded-full mr-4">
                      <StripeLogo />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Stripe</h3>
                      <p className="text-sm text-muted-foreground">Paiement sécurisé via Stripe</p>
                    </div>
                    <div className="w-5 h-5 rounded-full border border-primary flex items-center justify-center">
                      {paymentMethod === 'stripe' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Lock className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-sm">Paiement 100% sécurisé</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Toutes vos informations de paiement sont chiffrées et sécurisées. 
                    Nous utilisons les dernières technologies de sécurité pour protéger vos données.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-4">
                <Separator />
                {selectedPlanInfo && (
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="font-medium">Total</p>
                      <p className="text-sm text-muted-foreground">
                        Plan {selectedPlanInfo.name} ({selectedPlan === 'monthly' ? 'Mensuel' : 'Annuel'})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">
                        {formattedPrice(selectedPlan === 'monthly' ? selectedPlanInfo.monthlyPrice : selectedPlanInfo.yearlyPrice)} €
                      </p>
                      <p className="text-xs text-muted-foreground">HT</p>
                    </div>
                  </div>
                )}
                <Button className="w-full" onClick={handlePayment}>
                  Procéder au paiement
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
