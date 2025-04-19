
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseMapInitializationProps {
  mapboxToken: string;
  container: React.RefObject<HTMLDivElement>;
}

export const useMapInitialization = ({ mapboxToken, container }: UseMapInitializationProps) => {
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!container.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;

      map.current = new mapboxgl.Map({
        container: container.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [2.3488, 48.8534], // Paris par défaut
        zoom: 9
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      return () => {
        map.current?.remove();
      };
    } catch (err) {
      console.error('Error initializing map:', err);
    }
  }, [mapboxToken, container]);

  return map;
};
