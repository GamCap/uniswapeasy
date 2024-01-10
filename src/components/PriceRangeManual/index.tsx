import { PoolKeyStruct } from "../../abis/types/PoolManager";
import { StyledBoxSecondary } from "../../theme/components";
import { RowBetween } from "../Row";

export default function PoolKeySelect({
  token0,
  token1,
  priceLow,
  priceHigh,
  setLow,
  setHigh,
}: {
  token0?: string;
  token1?: string;
  priceLow?: number;
  priceHigh?: number;
  setLow?: (price: number) => void;
  setHigh?: (price: number) => void;
}) {
  return (
    <RowBetween gap="md">
      <StyledBoxSecondary>Placeholder Low Price</StyledBoxSecondary>
      <StyledBoxSecondary>Placeholder High Price</StyledBoxSecondary>
    </RowBetween>
  );
}
