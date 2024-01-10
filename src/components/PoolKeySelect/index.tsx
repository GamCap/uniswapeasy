import { AutoColumn } from "components/Column";
import { PoolKeyStruct } from "../../abis/types/PoolManager";
import { StyledBoxSecondary } from "../../theme/components";

export default function PoolKeySelect({
  poolKeys,
  selectedPoolKey,
  onSelect,
}: {
  poolKeys?: PoolKeyStruct[];
  selectedPoolKey?: PoolKeyStruct;
  onSelect?: (poolKey: PoolKeyStruct) => void;
}) {
  return <StyledBoxSecondary>Placeholder</StyledBoxSecondary>;
}
