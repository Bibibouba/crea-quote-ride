
import { useState, useEffect } from 'react';

type Coordinates = [number, number];
type RouteData = {
  distance: number;
  duration: number;
  geometry: {
    coordinates: Array<Coordinates>;
    type: string;
  };
};

export type Address = {
  id: string;
  name: string;
  fullAddress: string;
  coordinates: Coordinates;
};

export function useMapbox() {
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer le token depuis localStorage au démarrage
  useEffect(() => {
    const savedToken = localStorage.getItem('mapboxToken');
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  // Fonction pour définir un token
  const setToken = (token: string) => {
    localStorage.setItem('mapboxToken', token);
    setMapboxToken(token);
  };

  // Fonction de géocodage - convertit une adresse en coordonnées
  const geocodeAddress = async (address: string): Promise<Address | null> => {
    if (!mapboxToken) {
      setError("Token Mapbox manquant");
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${mapboxToken}&country=fr&limit=1`
      );

      if (!response.ok) {
        throw new Error(`Erreur de géocodage: ${response.status}`);
      }

      const data = await response.json();

      if (!data.features || data.features.length === 0) {
        setError("Aucune adresse trouvée");
        return null;
      }

      const feature = data.features[0];
      const coordinates = feature.center as Coordinates;
      const placeName = feature.place_name;

      return {
        id: feature.id,
        name: feature.text,
        fullAddress: placeName,
        coordinates
      };
    } catch (err) {
      setError(`Erreur: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Recherche d'adresses pour l'autocomplétion
  const searchAddresses = async (query: string): Promise<Address[]> => {
    if (!mapboxToken || query.length < 3) {
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxToken}&country=fr&limit=5`
      );

      if (!response.ok) {
        throw new Error(`Erreur de recherche d'adresses: ${response.status}`);
      }

      const data = await response.json();

      if (!data.features || data.features.length === 0) {
        return [];
      }

      return data.features.map((feature: any) => ({
        id: feature.id,
        name: feature.text,
        fullAddress: feature.place_name,
        coordinates: feature.center as Coordinates
      }));
    } catch (err) {
      setError(`Erreur: ${err instanceof Error ? err.message : String(err)}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Calcul d'itinéraire entre deux points
  const getRoute = async (
    start: Coordinates,
    end: Coordinates
  ): Promise<RouteData | null> => {
    if (!mapboxToken) {
      setError("Token Mapbox manquant");
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxToken}`
      );

      if (!response.ok) {
        throw new Error(`Erreur de calcul d'itinéraire: ${response.status}`);
      }

      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        setError("Aucun itinéraire trouvé");
        return null;
      }

      const route = data.routes[0];
      return {
        distance: route.distance / 1000, // Convertir en km
        duration: Math.round(route.duration / 60), // Convertir en minutes
        geometry: route.geometry
      };
    } catch (err) {
      setError(`Erreur: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mapboxToken,
    setToken,
    geocodeAddress,
    searchAddresses,
    getRoute,
    isLoading,
    error
  };
}
