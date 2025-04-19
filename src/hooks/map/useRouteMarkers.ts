
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseRouteMarkersProps {
  map: React.RefObject<mapboxgl.Map | null>;
  departure?: [number, number];
  destination?: [number, number];
  returnDestination?: [number, number];
  showReturn?: boolean;
  onRouteCalculated?: (distance: number, duration: number) => void;
  onReturnRouteCalculated?: (distance: number, duration: number) => void;
  mapboxToken: string;
}

export const useRouteMarkers = ({
  map,
  departure,
  destination,
  returnDestination,
  showReturn,
  onRouteCalculated,
  onReturnRouteCalculated,
  mapboxToken
}: UseRouteMarkersProps) => {
  useEffect(() => {
    if (!map.current || !departure || !destination) return;

    if (!map.current.loaded()) {
      map.current.on('load', () => {
        addMarkersAndRoute();
      });
    } else {
      addMarkersAndRoute();
    }

    function addMarkersAndRoute() {
      if (!map.current || !departure || !destination) return;

      // Clear existing markers
      const markers = document.querySelectorAll('.mapboxgl-marker');
      markers.forEach(marker => marker.remove());

      // Add new markers
      new mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat(departure)
        .addTo(map.current);

      new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(destination)
        .addTo(map.current);

      if (showReturn && returnDestination) {
        new mapboxgl.Marker({ color: '#22c55e' })
          .setLngLat(returnDestination)
          .addTo(map.current);
      }

      // Fit bounds to include all points
      const bounds = new mapboxgl.LngLatBounds()
        .extend(departure)
        .extend(destination);

      if (showReturn && returnDestination) {
        bounds.extend(returnDestination);
      }

      map.current.fitBounds(bounds, {
        padding: 100,
        maxZoom: 15
      });

      calculateRoute();
      
      if (showReturn && returnDestination) {
        console.log('Calculating return route on map from', destination, 'to', returnDestination);
        calculateReturnRoute(destination, returnDestination);
      }
    }

    async function calculateRoute() {
      if (!map.current || !departure || !destination || !mapboxToken) return;

      try {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${departure[0]},${departure[1]};${destination[0]},${destination[1]}?steps=true&geometries=geojson&access_token=${mapboxToken}`
        );

        if (!response.ok) {
          throw new Error(`Error fetching route: ${response.status}`);
        }

        const data = await response.json();

        if (!data.routes || data.routes.length === 0) {
          console.error("No routes found");
          return;
        }

        const route = data.routes[0];
        const distance = route.distance / 1000;
        const duration = Math.round(route.duration / 60);

        if (onRouteCalculated) {
          onRouteCalculated(distance, duration);
        }

        if (map.current.getSource('route')) {
          map.current.removeLayer('route');
          map.current.removeSource('route');
        }

        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route.geometry.coordinates
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
      }
    }

    async function calculateReturnRoute(start: [number, number], end: [number, number]) {
      if (!map.current || !start || !end || !mapboxToken) return;

      try {
        console.log(`Fetching return route from [${start[0]},${start[1]}] to [${end[0]},${end[1]}]`);
        
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxToken}`
        );

        if (!response.ok) {
          throw new Error(`Error fetching return route: ${response.status}`);
        }

        const data = await response.json();

        if (!data.routes || data.routes.length === 0) {
          console.error("No return routes found");
          return;
        }

        const route = data.routes[0];
        const distance = route.distance / 1000;
        const duration = Math.round(route.duration / 60);

        if (onReturnRouteCalculated) {
          onReturnRouteCalculated(distance, duration);
        }

        if (map.current.getSource('returnRoute')) {
          map.current.removeLayer('returnRoute');
          map.current.removeSource('returnRoute');
        }

        map.current.addSource('returnRoute', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route.geometry.coordinates
            }
          }
        });

        map.current.addLayer({
          id: 'returnRoute',
          type: 'line',
          source: 'returnRoute',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#22c55e',
            'line-width': 4,
            'line-opacity': 0.75
          }
        });
      } catch (err) {
        console.error('Error calculating return route:', err);
      }
    }
  }, [departure, destination, returnDestination, mapboxToken, onRouteCalculated, onReturnRouteCalculated, showReturn, map]);
};
