
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  address: string;
  zoom?: number;
}

const Map = ({ address, zoom = 13 }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('pk.eyJ1IjoidnRjemVuIiwiYSI6ImNtOTl1OXNqZzA4bGIyaXM2aWo2N2l6MDQifQ.daEqarjKUihmXDqV8hGswg');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to geocode the address and center the map
  const geocodeAddress = async (address: string, token: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${token}`
      );
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la géolocalisation: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        
        if (map.current) {
          map.current.setCenter([lng, lat]);
          
          // Add marker
          new mapboxgl.Marker({ color: '#3b82f6' })
            .setLngLat([lng, lat])
            .addTo(map.current);
        }
      } else {
        setError("Aucun résultat trouvé pour cette adresse");
        console.error("Aucun résultat trouvé pour cette adresse");
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      setError("Erreur lors de la géolocalisation de l'adresse");
    }
  };

  // Initialize map with token
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;
    
    try {
      // Clear any previous errors
      setError(null);
      
      console.log("Initializing map with token:", mapboxToken);
      
      // Set Mapbox token
      mapboxgl.accessToken = mapboxToken;
      
      // Create the map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: zoom,
        center: [2.2770, 48.8857], // Default to Paris until geocoding completes
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Hide the token input form
      setShowTokenInput(false);
      
      // Geocode the address when the map loads
      map.current.on('load', () => {
        console.log("Map loaded, geocoding address:", address);
        geocodeAddress(address, mapboxToken);
      });

      // Handle errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError("Erreur lors du chargement de la carte");
        setShowTokenInput(true);
      });
      
      // Save token to localStorage for future use
      localStorage.setItem('mapboxToken', mapboxToken);
    } catch (error) {
      console.error('Error initializing map:', error);
      setError("Erreur lors de l'initialisation de la carte. Vérifiez votre token.");
      setShowTokenInput(true);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, address, zoom]);

  // Check for saved token in localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('mapboxToken');
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  // Handle token submission
  const handleTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const tokenInput = form.elements.namedItem('mapboxToken') as HTMLInputElement;
    if (tokenInput.value.trim()) {
      setMapboxToken(tokenInput.value.trim());
    } else {
      setError("Veuillez entrer un token Mapbox valide");
    }
  };

  return (
    <div className="relative w-full h-full">
      {showTokenInput ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted p-4">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="font-semibold mb-4">Mapbox Token Requis</h3>
            {error && (
              <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}
            <p className="text-sm text-muted-foreground mb-4">
              Pour afficher la carte, veuillez entrer votre token public Mapbox. 
              Vous pouvez l'obtenir sur <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>.
            </p>
            <form onSubmit={handleTokenSubmit}>
              <input
                type="text"
                name="mapboxToken"
                placeholder="pk.eyJ1Ijoi..."
                className="w-full p-2 border rounded mb-2"
                defaultValue={mapboxToken}
                required
              />
              <button 
                type="submit" 
                className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 w-full"
              >
                Afficher la carte
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div ref={mapContainer} className="absolute inset-0" />
      )}
    </div>
  );
};

export default Map;
