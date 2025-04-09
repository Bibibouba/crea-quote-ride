
import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      content: "Grâce à CREACODEAL, j'économise un temps précieux chaque jour. Plus besoin de calculer manuellement les devis, tout est automatisé et mes clients sont impressionnés par le professionnalisme du service.",
      author: "Thomas L.",
      role: "Chauffeur VTC à Lyon",
      rating: 5
    },
    {
      content: "L'intégration du module sur mon site a été d'une simplicité incroyable. Mes clients peuvent désormais obtenir un devis instantané et le signer directement en ligne. Un vrai plus pour mon activité !",
      author: "Sarah M.",
      role: "Chauffeur VTC à Paris",
      rating: 5
    },
    {
      content: "Le rapport qualité-prix est imbattable. Pour moins de 10€ par mois, j'ai un outil complet qui me permet de gérer mes devis et factures de manière professionnelle. Je recommande vivement.",
      author: "Jean-Pierre D.",
      role: "Chauffeur VTC à Marseille",
      rating: 5
    }
  ];

  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Ce que disent nos clients
          </h2>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Des chauffeurs VTC satisfaits partout en France
          </p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="flex flex-col p-6 bg-background rounded-xl border shadow-sm"
            >
              <div className="flex mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <p className="flex-1 text-base leading-relaxed">"{testimonial.content}"</p>
              <div className="mt-6">
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
