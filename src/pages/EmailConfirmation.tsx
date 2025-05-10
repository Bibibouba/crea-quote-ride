
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/connexion/LoginForm';
import { Link } from 'react-router-dom';

const EmailConfirmation = () => {
  return (
    <Layout>
      <div className="container py-20">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Bienvenue chez VTCZen</CardTitle>
              <CardDescription>
                Veuillez entrer votre identifiant (adresse mail) et votre mot de passe pour vous connecter.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <LoginForm />
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm text-muted-foreground">
                Déjà connecté avant ?{' '}
                <Link to="/connexion" className="text-primary hover:underline">
                  Connexion standard
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default EmailConfirmation;
