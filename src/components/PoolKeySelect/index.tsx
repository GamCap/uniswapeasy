import { StyledBoxSecondary } from "../../theme/components";
import { PoolKey } from "state/v4/hooks";

export default function PoolKeySelect({
  poolKeys,
  selectedPoolKey,
  onSelect,
}: {
  poolKeys?: PoolKey[];
  selectedPoolKey?: PoolKey;
  onSelect?: (poolKey: PoolKey) => void;
}) {
  return <StyledBoxSecondary>Placeholder</StyledBoxSecondary>;
}
