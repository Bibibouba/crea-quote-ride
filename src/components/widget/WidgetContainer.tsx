import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SimulatorContainer from '@/components/simulator/SimulatorContainer';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useWidgetParams } from '@/hooks/useWidgetParams';

// Interface pour les paramètres du widget
interface WidgetSettings {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  logoUrl?: string;
  bannerUrl?: string;
  companyName?: string;
}

// Interface pour les props du SimulatorContainer
interface SimulatorContainerProps {
  isWidget?: boolean;
  companyName?: string;
  logoUrl?: string;
  prefill?: {
    departure?: string;
    destination?: string;
    date?: string;
    time?: string;
    passengers?: string;
    vehicleType?: string;
  };
}

// Fonction utilitaire pour envoyer des messages au parent (iframe)
const postToParent = (event: string, data: any) => {
  if (window.parent !== window) {
    window.parent.postMessage({ event, data }, '*');
  }
};

export const WidgetContainer = () => {
  const { driverId } = useParams<{ driverId: string }>();
  const { prefill } = useWidgetParams();
  const [settings, setSettings] = useState<WidgetSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDriverSettings = async () => {
      try {
        if (!driverId) {
          setError("ID du chauffeur manquant");
          setLoading(false);
          return;
        }

        // Récupérer les paramètres de l'entreprise
        const { data, error } = await supabase
          .from('company_settings')
          .select('primary_color, secondary_color, font_family, logo_url, banner_url, company_name')
          .eq('driver_id', driverId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setSettings({
            primaryColor: data.primary_color || '#3B82F6',
            secondaryColor: data.secondary_color || '#10B981',
            fontFamily: data.font_family || 'Inter',
            logoUrl: data.logo_url || null,
            bannerUrl: data.banner_url || null,
            companyName: data.company_name || 'VTC Services'
          });
        }

const { data: profileData, error: profileError } = await supabase
  .from('profiles')
  .select('is_approved')
  .eq('id', driverId)
  .single();

if (profileError) {
  throw profileError;
}

if (!profileData?.is_approved) {
  const msg = "Ce chauffeur n'est pas approuvé pour utiliser le widget";
  setError(msg);
  postToParent('QUOTE_ERROR', { message: msg });
}



      } catch (err: any) {
        console.error('Erreur lors du chargement des paramètres du widget:', err);
        setError("Impossible de charger les paramètres du widget");
        toast.error("Erreur de chargement");
        postToParent('QUOTE_ERROR', { message: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchDriverSettings();
  }, [driverId]);

  // Appliquer les styles personnalisés
  useEffect(() => {
    if (settings) {
      const root = document.documentElement;
      
      // Appliquer les couleurs si elles sont définies
      if (settings.primaryColor) {
        root.style.setProperty('--widget-primary-color', settings.primaryColor);
      }
      
      if (settings.secondaryColor) {
        root.style.setProperty('--widget-secondary-color', settings.secondaryColor);
      }
      
      // Appliquer la police si elle est définie
      if (settings.fontFamily) {
        root.style.setProperty('--widget-font-family', settings.fontFamily);
      }
    }
    
    return () => {
      const root = document.documentElement;
      root.style.removeProperty('--widget-primary-color');
      root.style.removeProperty('--widget-secondary-color');
      root.style.removeProperty('--widget-font-family');
    };
  }, [settings]);

  // Informer le parent du changement d'étape (initialisation)
  useEffect(() => {
    postToParent('STEP_CHANGED', { step: 0, name: 'Initialisation' });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background p-4">
        <div className="text-destructive text-lg font-semibold mb-2">Erreur</div>
        <div className="text-muted-foreground text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-background widget-container" style={{ fontFamily: 'var(--widget-font-family, sans-serif)' }}>
      {settings?.logoUrl && (
        <div className="flex justify-center py-4">
          <img 
            src={settings.logoUrl} 
            alt={settings.companyName || "Logo"} 
            className="h-12 w-auto object-contain" 
          />
        </div>
      )}
      <SimulatorContainer 
        isWidget={true}
        prefill={prefill}
        companyName={settings?.companyName} 
        logoUrl={settings?.logoUrl}
      />
    </div>
  );
};

export default WidgetContainer;
