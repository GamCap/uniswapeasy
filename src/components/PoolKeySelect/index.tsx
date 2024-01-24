import { BoxSecondary } from "../../theme/components";
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
  return <BoxSecondary $padding="4px 12px 4px 12px">Placeholder</BoxSecondary>;
}
