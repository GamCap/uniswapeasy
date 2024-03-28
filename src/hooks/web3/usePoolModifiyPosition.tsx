import { useEffect, useState } from "react";
import { Contract } from "@ethersproject/contracts";
import PoolModifyLiquidityTest from "../../abis/PoolModifyLiquidityTest.json";
import useConnectors from "./useConnectors";

const POOL_MODIFYLIQUIDITY_ADDRESS =
  "0x140C64C63c52cE05138E21564b72b0B2Dff9B67f";

function usePoolModifyLiquidity() {
  const connectors = useConnectors();
  const [poolModifyLiquidity, setPoolModifyLiquidity] =
    useState<null | Contract>(null);

  useEffect(() => {
    if (connectors && connectors.user) {
      const poolModifyPositionContract = new Contract(
        POOL_MODIFYLIQUIDITY_ADDRESS,
        PoolModifyLiquidityTest.abi,
        connectors.user.provider as any
      );
      setPoolModifyLiquidity(poolModifyPositionContract);
    }
  }, [connectors]);

  return {
    poolModifyLiquidity,
  };
}

export default usePoolModifyLiquidity;
