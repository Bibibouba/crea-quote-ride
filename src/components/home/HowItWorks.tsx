
import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Inscription simple",
      description: "Créez votre compte en quelques minutes et configurez votre profil chauffeur VTC."
    },
    {
      number: "02",
      title: "Configuration personnalisée",
      description: "Paramétrez vos tarifs, ajoutez vos véhicules et personnalisez votre module de devis."
    },
    {
      number: "03",
      title: "Intégration sur votre site",
      description: "Ajoutez le module de devis sur votre site web grâce au code d'intégration fourni."
    },
    {
      number: "04",
      title: "Réception des devis",
      description: "Vos clients remplissent le formulaire et reçoivent instantanément un devis par email."
    }
  ];

  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Comment ça marche
          </h2>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Mise en place simple et rapide pour commencer à recevoir des devis
          </p>
        </div>
        
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  {step.number}
                </div>
                <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
