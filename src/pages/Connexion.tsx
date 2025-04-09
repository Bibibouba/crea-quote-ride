
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/connexion/LoginForm';
import SignupPrompt from '@/components/connexion/SignupPrompt';

const Connexion = () => {
  return (
    <Layout>
      <div className="container py-20">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Connexion</CardTitle>
              <CardDescription>
                Entrez vos identifiants pour accéder à votre espace personnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <LoginForm />
            </CardContent>
            <CardFooter className="flex justify-center">
              <SignupPrompt />
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Connexion;
