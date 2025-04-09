
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
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  // Function to geocode the address and center the map
  const geocodeAddress = async (address: string, token: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${token}`
      );
      
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
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  };

  // Initialize map when token is provided
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;
    
    setShowTokenInput(false);
    
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: zoom,
      center: [2.2770, 48.8857], // Default to Paris until geocoding completes
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Geocode the address when the map loads
    map.current.on('load', () => {
      geocodeAddress(address, mapboxToken);
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, address, zoom]);

  // Handle token submission
  const handleTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const tokenInput = form.elements.namedItem('mapboxToken') as HTMLInputElement;
    setMapboxToken(tokenInput.value);
  };

  return (
    <div className="relative w-full h-full">
      {showTokenInput ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted p-4">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="font-semibold mb-4">Mapbox Token Requis</h3>
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
