
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';

const Inscription = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Essai gratuit</CardTitle>
              <CardDescription>
                Créez votre compte pour accéder à toutes les fonctionnalités pendant 14 jours sans engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">Prénom</Label>
                  <Input id="first-name" placeholder="Jean" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Nom</Label>
                  <Input id="last-name" placeholder="Dupont" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <Input id="email" type="email" placeholder="jean.dupont@votreentreprise.com" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input id="password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-confirm">Confirmer le mot de passe</Label>
                  <Input id="password-confirm" type="password" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Nom de votre entreprise</Label>
                <Input id="company" placeholder="VTC Premium Services" />
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  J'accepte les <Link to="/conditions" className="text-primary hover:underline">conditions d'utilisation</Link> et la <Link to="/confidentialite" className="text-primary hover:underline">politique de confidentialité</Link>
                </Label>
              </div>
              
              <Button type="submit" className="w-full">
                Commencer mon essai gratuit
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Aucune carte bancaire requise. Vous pourrez configurer vos tarifs et tester toutes les fonctionnalités pendant 14 jours.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm text-muted-foreground">
                Déjà inscrit?{' '}
                <Link to="/connexion" className="text-primary hover:underline">
                  Se connecter
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Inscription;
