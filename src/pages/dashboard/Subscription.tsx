
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, PaypalIcon, Lock, Check, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

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

const Subscription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'stripe'>('card');
  
  const handlePayment = () => {
    // This would be replaced with actual payment handling logic
    alert(`Le paiement via ${paymentMethod} sera implémenté prochainement.`);
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
        
        <Tabs defaultValue="pricing" className="space-y-6">
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
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle>Essentiel</CardTitle>
                  <CardDescription>
                    Idéal pour les chauffeurs individuels
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">
                      {selectedPlan === 'monthly' ? '19,99€' : '191,90€'}
                    </span>
                    <span className="text-muted-foreground">
                      {selectedPlan === 'monthly' ? '/mois' : '/an'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PricingFeature included={true} text="Jusqu'à 3 véhicules" />
                  <PricingFeature included={true} text="50 devis par mois" />
                  <PricingFeature included={true} text="Support email" />
                  <PricingFeature included={false} text="Personnalisation complète" />
                  <PricingFeature included={false} text="Facturation automatique" />
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigate('/dashboard/subscription?tab=payment&plan=essential')}>
                    Choisir <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border-2 border-primary relative overflow-hidden">
                <div className="absolute -right-12 top-7 rotate-45 bg-primary text-white text-xs py-1 px-12">
                  Populaire
                </div>
                <CardHeader>
                  <CardTitle>Professionnel</CardTitle>
                  <CardDescription>
                    Parfait pour les petites entreprises
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">
                      {selectedPlan === 'monthly' ? '39,99€' : '383,90€'}
                    </span>
                    <span className="text-muted-foreground">
                      {selectedPlan === 'monthly' ? '/mois' : '/an'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PricingFeature included={true} text="Jusqu'à 10 véhicules" />
                  <PricingFeature included={true} text="Devis illimités" />
                  <PricingFeature included={true} text="Support email et téléphone" />
                  <PricingFeature included={true} text="Personnalisation complète" />
                  <PricingFeature included={false} text="Facturation automatique" />
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigate('/dashboard/subscription?tab=payment&plan=professional')}>
                    Choisir <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Entreprise</CardTitle>
                  <CardDescription>
                    Adapté aux sociétés de transport
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">
                      {selectedPlan === 'monthly' ? '89,99€' : '863,90€'}
                    </span>
                    <span className="text-muted-foreground">
                      {selectedPlan === 'monthly' ? '/mois' : '/an'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PricingFeature included={true} text="Véhicules illimités" />
                  <PricingFeature included={true} text="Devis illimités" />
                  <PricingFeature included={true} text="Support prioritaire 24/7" />
                  <PricingFeature included={true} text="Personnalisation complète" />
                  <PricingFeature included={true} text="Facturation automatique" />
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigate('/dashboard/subscription?tab=payment&plan=enterprise')}>
                    Choisir <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
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
                <div className="flex items-center justify-between w-full">
                  <div>
                    <p className="font-medium">Total</p>
                    <p className="text-sm text-muted-foreground">Plan Professionnel (Mensuel)</p>
                  </div>
                  <p className="text-xl font-bold">39,99 €</p>
                </div>
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
