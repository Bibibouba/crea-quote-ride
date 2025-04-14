
interface QuoteFooterProps {}

export const QuoteFooter: React.FC<QuoteFooterProps> = () => {
  return (
    <p className="text-xs text-muted-foreground text-center">
      * Ce montant est une estimation et peut varier en fonction des conditions réelles de circulation
    </p>
  );
};
