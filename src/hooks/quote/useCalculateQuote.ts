
import { FormEvent } from 'react';

interface UseCalculateQuoteProps {
  handleSubmit: (
    e: FormEvent,
    departureCoordinates?: [number, number],
    destinationCoordinates?: [number, number]
  ) => void;
  departureCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
}

export const useCalculateQuote = ({
  handleSubmit,
  departureCoordinates,
  destinationCoordinates
}: UseCalculateQuoteProps) => {
  const handleCalculateQuote = () => {
    handleSubmit(
      new Event('submit') as unknown as React.FormEvent,
      departureCoordinates,
      destinationCoordinates
    );
  };
  
  return {
    handleCalculateQuote
  };
};
