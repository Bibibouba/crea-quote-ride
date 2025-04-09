
import React from 'react';
import { 
  CalculatorIcon, 
  CarFrontIcon, 
  ClockIcon, 
  CreditCardIcon, 
  FileTextIcon, 
  GaugeIcon, 
  MapPinIcon, 
  PencilRulerIcon, 
  UsersIcon 
} from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({ icon, title, description }: FeatureProps) => {
  return (
    <div className="flex flex-col items-start gap-2 rounded-lg border p-6 bg-background shadow-sm transition-all hover:shadow-md">
      <div className="rounded-lg bg-primary/10 p-2 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <CalculatorIcon className="h-5 w-5" />,
      title: "Tarification personnalisée",
      description: "Définissez vos propres tarifs au kilomètre et frais d'attente selon vos besoins."
    },
    {
      icon: <CarFrontIcon className="h-5 w-5" />,
      title: "Multiples véhicules",
      description: "Proposez différents types de véhicules à vos clients avec des tarifs spécifiques."
    },
    {
      icon: <MapPinIcon className="h-5 w-5" />,
      title: "Calcul précis des distances",
      description: "Estimation précise des distances et durées grâce à l'API Google Maps."
    },
    {
      icon: <ClockIcon className="h-5 w-5" />,
      title: "Heures d'attente",
      description: "Paramétrez différents tarifs d'attente selon la durée et le moment."
    },
    {
      icon: <FileTextIcon className="h-5 w-5" />,
      title: "Devis et factures PDF",
      description: "Générez des devis professionnels et des factures envoyés directement par email."
    },
    {
      icon: <PencilRulerIcon className="h-5 w-5" />,
      title: "Personnalisation visuelle",
      description: "Adaptez l'apparence des devis avec votre logo et votre charte graphique."
    },
    {
      icon: <GaugeIcon className="h-5 w-5" />,
      title: "Module intégrable",
      description: "Intégrez facilement le module de devis sur votre site web via iframe ou script."
    },
    {
      icon: <UsersIcon className="h-5 w-5" />,
      title: "Signature en ligne",
      description: "Vos clients peuvent signer électroniquement les devis directement en ligne."
    },
    {
      icon: <CreditCardIcon className="h-5 w-5" />,
      title: "Tarif abordable",
      description: "Solution complète à seulement 9,99€ par mois, sans engagement."
    }
  ];

  return (
    <section id="features" className="py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Toutes les fonctionnalités dont vous avez besoin
          </h2>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Simplifiez votre quotidien de chauffeur VTC et offrez une expérience professionnelle à vos clients
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
