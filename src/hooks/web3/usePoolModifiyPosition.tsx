import { useEffect, useState } from "react";
import { Contract } from "@ethersproject/contracts";
import PoolModifyPositionTest from "../../abis/PoolModifyPositionTest.json";
import useConnectors from "./useConnectors";

const POOL_MODIFYPOSITION_ADDRESS =
  "0x83feDBeD11B3667f40263a88e8435fca51A03F8C";

function usePoolModifyPosition() {
  const connectors = useConnectors();
  const [poolModifyPosition, setPoolModifyPosition] = useState<null | Contract>(
    null
  );

  useEffect(() => {
    if (connectors && connectors.user) {
      const poolModifyPositionContract = new Contract(
        POOL_MODIFYPOSITION_ADDRESS,
        PoolModifyPositionTest.abi,
        connectors.user.provider as any
      );
      setPoolModifyPosition(poolModifyPositionContract);
    }
  }, [connectors]);

  return {
    poolModifyPosition,
  };
}

export default usePoolModifyPosition;
