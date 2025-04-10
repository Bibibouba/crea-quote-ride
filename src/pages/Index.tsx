
import React from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import Pricing from '@/components/home/Pricing';
import Testimonials from '@/components/home/Testimonials';
import CTA from '@/components/home/CTA';
import QuoteForm from '@/components/quote/QuoteForm';
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <div id="quote-form" className="py-12 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-10">Simulez un devis</h2>
          <QuoteForm showDashboardLink={false} />
        </div>
      </div>
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTA />
      <Toaster />
    </Layout>
  );
};

export default Index;
