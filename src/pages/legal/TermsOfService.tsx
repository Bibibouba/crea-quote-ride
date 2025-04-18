
import React from 'react';
import Layout from '@/components/Layout';

const TermsOfService = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Conditions d'utilisation</h1>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Article 1 – Éditeur</h2>
            <p className="text-muted-foreground">
              Le site VTCZen.fr est édité par la société VTCZen, SAS au capital de 10 000 €, 
              immatriculée au RCS de Paris sous le n° 123 456 789, dont le siège social est situé 45 rue de la République, 
              75002 Paris. Directeur de la publication : M. Jean Dupont.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Article 2 – Objet</h2>
            <p className="text-muted-foreground">
              Les présentes conditions d'utilisation (« CGU ») régissent l'accès et l'utilisation du site VTCZen.fr. 
              En se connectant, l'utilisateur reconnaît avoir pris connaissance des CGU et les accepter sans réserve.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Article 3 – Accès au service</h2>
            <p className="text-muted-foreground">
              VTCZen.fr propose la mise en relation entre clients et chauffeurs VTC. L'accès est gratuit et réservé 
              aux personnes majeures disposant d'un accès Internet. VTCZen se réserve le droit de modifier, suspendre 
              ou interrompre sans préavis l'accès à tout ou partie du site.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Article 4 – Propriété intellectuelle</h2>
            <p className="text-muted-foreground">
              Tous les éléments (textes, graphismes, logos, images, vidéos…) sont protégés par le droit de la propriété 
              intellectuelle et sont la propriété exclusive de VTCZen ou de ses partenaires. Toute reproduction non 
              autorisée est strictement interdite.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Article 5 – Responsabilité</h2>
            <p className="text-muted-foreground">
              VTCZen met en œuvre tous les moyens raisonnables pour assurer l'exactitude des informations. Toutefois, 
              VTCZen ne saurait être tenu responsable des erreurs ou omissions, ni des dommages résultant de l'accès 
              ou de l'utilisation du site.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Article 6 – Liens externes</h2>
            <p className="text-muted-foreground">
              Les liens vers d'autres sites ne sauraient engager la responsabilité de VTCZen. Leur présence n'implique 
              pas l'approbation du contenu par VTCZen.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Article 7 – Modification des CGU</h2>
            <p className="text-muted-foreground">
              VTCZen se réserve le droit de modifier à tout moment les CGU. Les nouvelles CGU entreront en vigueur 
              dès leur publication en ligne. L'utilisateur est invité à les consulter régulièrement.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Article 8 – Loi applicable & juridiction compétente</h2>
            <p className="text-muted-foreground">
              Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation ou exécution 
              sera de la compétence exclusive des tribunaux de Paris.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
