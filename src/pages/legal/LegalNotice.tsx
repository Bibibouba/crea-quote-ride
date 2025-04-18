
import React from 'react';
import Layout from '@/components/Layout';
import { useScrollToTop } from '@/hooks/use-scroll-top';

const LegalNotice = () => {
  useScrollToTop();

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Mentions légales</h1>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Éditeur</h2>
            <p className="text-muted-foreground">
              VTCZen SAS – RCS Paris 123 456 789 – SIRET : 123 456 789 00010 – TVA intracom : FR12 123456789
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Siège social</h2>
            <p className="text-muted-foreground">
              45 rue de la République, 75002 Paris<br />
              Tél. : 01 23 45 67 89<br />
              Email : contact@vtczen.fr
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Direction</h2>
            <p className="text-muted-foreground">
              Directeur de la publication : M. Jean Dupont
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Hébergement</h2>
            <p className="text-muted-foreground">
              OVH SAS – 2 rue Kellermann, 59100 Roubaix<br />
              Site web : www.ovh.com<br />
              Tél. : 09 72 10 10 07
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Conception & réalisation</h2>
            <p className="text-muted-foreground">
              VTCZen
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Litiges</h2>
            <p className="text-muted-foreground">
              Droit français, tribunaux de Paris
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">CNIL</h2>
            <p className="text-muted-foreground">
              Déclaration n° XXXXXX
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default LegalNotice;
