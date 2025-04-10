
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MapTokenInputProps {
  tokenInputValue: string;
  setTokenInputValue: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error?: string | null;
}

const MapTokenInput: React.FC<MapTokenInputProps> = ({
  tokenInputValue,
  setTokenInputValue,
  onSubmit,
  error
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-muted p-4">
      <form onSubmit={onSubmit} className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
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
  );
};

export default MapTokenInput;
