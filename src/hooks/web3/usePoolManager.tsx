import { useEffect, useState } from "react";
import { Contract } from "@ethersproject/contracts";
import PoolManagerABI from "../../abis/PoolManager.json";
import useConnectors from "./useConnectors";
import { PoolManager } from "../../abis/types/PoolManager";

const POOL_MANAGER_ADDRESS = "0x64255ed21366DB43d89736EE48928b890A84E2Cb";

function usePoolManager() {
  const connectors = useConnectors();
  const [poolManager, setPoolManager] = useState<null | PoolManager>(null);

  useEffect(() => {
    if (connectors && connectors.user) {
      const poolManagerContract = new Contract(
        POOL_MANAGER_ADDRESS,
        PoolManagerABI.abi,
        connectors.user.provider as any
      ) as PoolManager;
      setPoolManager(poolManagerContract);
    }
  }, [connectors]);

  return {
    poolManager,
  };
}

export default usePoolManager;
