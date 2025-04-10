
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapbox } from '@/hooks/useMapbox';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RouteMapProps {
  departure?: [number, number];
  destination?: [number, number];
  className?: string;
  onRouteCalculated?: (distance: number, duration: number) => void;
}

const RouteMap: React.FC<RouteMapProps> = ({
  departure,
  destination,
  className,
  onRouteCalculated
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { mapboxToken, setToken, getRoute, error: mapboxError } = useMapbox();
  const { toast } = useToast();
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [tokenInputValue, setTokenInputValue] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) {
      if (!mapboxToken) {
        setShowTokenInput(true);
      }
      return;
    }

    try {
      mapboxgl.accessToken = mapboxToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [2.3488, 48.8534], // Paris par défaut
        zoom: 9
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        console.log('Map loaded');
        setMapLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setShowTokenInput(true);
      });

      return () => {
        map.current?.remove();
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      setShowTokenInput(true);
    }
  }, [mapboxToken]);

  // Gérer les marqueurs et l'itinéraire lorsque les coordonnées changent
  useEffect(() => {
    if (!mapLoaded || !map.current || !departure || !destination) {
      return;
    }

    // Nettoyer les marqueurs existants
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => marker.remove());

    // Ajouter les nouveaux marqueurs
    new mapboxgl.Marker({ color: '#3b82f6' })
      .setLngLat(departure)
      .addTo(map.current);

    new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat(destination)
      .addTo(map.current);

    // Ajuster la vue pour inclure les deux points
    const bounds = new mapboxgl.LngLatBounds()
      .extend(departure)
      .extend(destination);

    map.current.fitBounds(bounds, {
      padding: 100,
      maxZoom: 15
    });

    // Calculer et afficher l'itinéraire
    const calculateRoute = async () => {
      try {
        const routeData = await getRoute(departure, destination);
        
        if (!routeData || !map.current) {
          return;
        }

        // Si un callback est fourni pour les informations de route
        if (onRouteCalculated) {
          onRouteCalculated(routeData.distance, routeData.duration);
        }

        // Supprimer la source et la couche si elles existent déjà
        if (map.current.getSource('route')) {
          map.current.removeLayer('route');
          map.current.removeSource('route');
        }

        // Ajouter la nouvelle source et couche pour l'itinéraire
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString', // Fix: Specify the exact type instead of using a variable
              coordinates: routeData.geometry.coordinates
            }
          }
        });

        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 4,
            'line-opacity': 0.75
          }
        });
      } catch (err) {
        console.error('Error calculating route:', err);
        toast({
          title: 'Erreur',
          description: 'Impossible de calculer l\'itinéraire',
          variant: 'destructive'
        });
      }
    };

    calculateRoute();
  }, [departure, destination, mapLoaded, getRoute, onRouteCalculated, toast]);

  // Gérer les erreurs Mapbox
  useEffect(() => {
    if (mapboxError) {
      toast({
        title: 'Erreur Mapbox',
        description: mapboxError,
        variant: 'destructive'
      });
    }
  }, [mapboxError, toast]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInputValue.trim()) {
      setToken(tokenInputValue.trim());
      setShowTokenInput(false);
    } else {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer un token Mapbox valide',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className={`relative w-full h-96 rounded-lg overflow-hidden border ${className}`}>
      {showTokenInput ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted p-4">
          <form onSubmit={handleTokenSubmit} className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="font-semibold mb-4">Mapbox Token Requis</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Pour afficher la carte, veuillez entrer votre token public Mapbox. 
              Vous pouvez l'obtenir sur <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>.
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mapboxToken">Token Mapbox</Label>
                <Input
                  id="mapboxToken"
                  type="text"
                  placeholder="pk.eyJ1Ijoi..."
                  value={tokenInputValue}
                  onChange={(e) => setTokenInputValue(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Afficher la carte</Button>
            </div>
          </form>
        </div>
      ) : (
        <div ref={mapContainer} className="absolute inset-0" />
      )}
    </div>
  );
};

export default RouteMap;
