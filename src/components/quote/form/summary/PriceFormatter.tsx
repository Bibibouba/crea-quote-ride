
import { cn } from "@/lib/utils";

interface PriceFormatterProps {
  price: number;
  className?: string;
}

export const PriceFormatter = ({ price, className }: PriceFormatterProps) => {
  return <span className={cn(className)}>{price.toFixed(1)}€</span>;
};
