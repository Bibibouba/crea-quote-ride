
interface PriceFormatterProps {
  price: number;
}

export const PriceFormatter = ({ price }: PriceFormatterProps) => {
  return <span>{price.toFixed(1)}€</span>;
};
