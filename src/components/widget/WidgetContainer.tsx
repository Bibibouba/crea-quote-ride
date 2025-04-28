import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SimulatorContainer from '@/components/simulator/SimulatorContainer';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useWidgetParams } from '@/hooks/useWidgetParams';

interface WidgetSettings {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  logoUrl?: string;
  bannerUrl?: string;
  companyName?: string;
}

// Envoi de message à l'iframe parent
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

        const { data, error } = await supabase
          .from('company_settings')
          .select(`
            couleur_primaire,
            couleur_secondaire,
            famille_de_polices,
            logo_url,
            bannière_url,
            "Nom de l'entreprise"
          `)
          .eq('driver_id', driverId)
          .single();

        if (error) throw error;

        if (data) {
          setSettings({
            primaryColor: data.couleur_primaire || '#3B82F6',
            secondaryColor: data.couleur_secondaire || '#10B981',
            fontFamily: data.famille_de_polices || 'Inter',
            logoUrl: data.logo_url || null,
            bannerUrl: data.bannière_url || null,
            companyName: data["Nom de l'entreprise"] || 'VTC Services'
          });
        }

        // 🔥 Désactivation temporaire de la validation chauffeur pour test
        console.log('Validation chauffeur désactivée pour les tests du widget.');

      } catch (err: any) {
        console.error('Erreur:', err);
        const errMsg = err.message || err;
        setError(`Erreur: ${errMsg}`);
        toast.error(`Erreur: ${errMsg}`);
        postToParent('QUOTE_ERROR', { message: errMsg });
      } finally {
        setLoading(false);
      }
    };

    fetchDriverSettings();
  }, [driverId]);

  useEffect(() => {
    if (settings) {
      const root = document.documentElement;
      if (settings.primaryColor) root.style.setProperty('--widget-primary-color', settings.primaryColor);
      if (settings.secondaryColor) root.style.setProperty('--widget-secondary-color', settings.secondaryColor);
      if (settings.fontFamily) root.style.setProperty('--widget-font-family', settings.fontFamily);
    }

    return () => {
      const root = document.documentElement;
      root.style.removeProperty('--widget-primary-color');
      root.style.removeProperty('--widget-secondary-color');
      root.style.removeProperty('--widget-font-family');
    };
  }, [settings]);

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
