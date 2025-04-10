
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WaitingTimeOption } from '@/hooks/useQuoteForm';

interface WaitingTimeSelectorProps {
  waitingTimeMinutes: number;
  setWaitingTimeMinutes: (minutes: number) => void;
  waitingTimeOptions: WaitingTimeOption[];
  waitingTimePrice: number;
}

const WaitingTimeSelector: React.FC<WaitingTimeSelectorProps> = ({
  waitingTimeMinutes,
  setWaitingTimeMinutes,
  waitingTimeOptions,
  waitingTimePrice
}) => {
  return (
    <div className="p-3 bg-muted/20 rounded-md">
      <Label htmlFor="waiting-time-minutes">Temps d'attente</Label>
      <Select
        value={waitingTimeMinutes.toString()}
        onValueChange={(value) => setWaitingTimeMinutes(parseInt(value))}
      >
        <SelectTrigger id="waiting-time-minutes" className="mt-1.5">
          <SelectValue placeholder="Sélectionnez le temps d'attente" />
        </SelectTrigger>
        <SelectContent>
          {waitingTimeOptions.map(option => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label} (+{(option.value / 15) * 7.5} €)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default WaitingTimeSelector;
