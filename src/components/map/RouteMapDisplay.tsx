
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface RouteMapDisplayProps {
  mapboxToken: string;
  departure?: [number, number];
  destination?: [number, number];
  onRouteCalculated?: (distance: number, duration: number) => void;
  returnDestination?: [number, number]; // Nouvelle prop pour l'adresse de retour
  onReturnRouteCalculated?: (distance: number, duration: number) => void; // Callback pour le trajet retour
  showReturn?: boolean; // Indique si on doit afficher le trajet retour
}

const RouteMapDisplay: React.FC<RouteMapDisplayProps> = ({
  mapboxToken,
  departure,
  destination,
  onRouteCalculated,
  returnDestination,
  onReturnRouteCalculated,
  showReturn = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Initialize the map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
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
  }, [mapboxToken]);

  // Handle markers and route
  useEffect(() => {
    if (!map.current || !departure || !destination) return;

    // Wait for map to be loaded
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

      // Add return destination marker if needed
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

      // Calculate and display route(s)
      calculateRoute();
      
      // Calculate return route if needed
      if (showReturn) {
        const returnStart = destination;
        const returnEnd = returnDestination || departure;
        calculateReturnRoute(returnStart, returnEnd);
      }
    }

    async function calculateRoute() {
      if (!map.current || !departure || !destination || !mapboxToken) return;

      try {
        // Get directions from Mapbox API
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
        const distance = route.distance / 1000; // km
        const duration = Math.round(route.duration / 60); // minutes

        // Call callback with route data
        if (onRouteCalculated) {
          onRouteCalculated(distance, duration);
        }

        // Remove existing route layer and source
        if (map.current.getSource('route')) {
          map.current.removeLayer('route');
          map.current.removeSource('route');
        }

        // Add new route layer in blue
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
            'line-color': '#3b82f6', // Bleu pour l'aller
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
        // Get directions from Mapbox API for return route
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
        const distance = route.distance / 1000; // km
        const duration = Math.round(route.duration / 60); // minutes

        // Call callback with return route data
        if (onReturnRouteCalculated) {
          onReturnRouteCalculated(distance, duration);
        }

        // Remove existing return route layer and source if exists
        if (map.current.getSource('returnRoute')) {
          map.current.removeLayer('returnRoute');
          map.current.removeSource('returnRoute');
        }

        // Add new return route layer in green
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
            'line-color': '#22c55e', // Vert pour le retour
            'line-width': 4,
            'line-opacity': 0.75
          }
        });
      } catch (err) {
        console.error('Error calculating return route:', err);
      }
    }
  }, [departure, destination, returnDestination, mapboxToken, onRouteCalculated, onReturnRouteCalculated, showReturn]);

  return <div ref={mapContainer} className="absolute inset-0" />;
};

export default RouteMapDisplay;
