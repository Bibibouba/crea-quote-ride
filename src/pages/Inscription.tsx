
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import InscriptionForm from '@/components/inscription/InscriptionForm';

const Inscription = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="container py-12 flex justify-center items-center">
          <div className="text-center">
            Chargement...
          </div>
        </div>
      </Layout>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

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
            <CardContent>
              <InscriptionForm />
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
