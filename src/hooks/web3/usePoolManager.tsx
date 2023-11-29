import { useEffect, useState } from "react";
import { Contract } from "@ethersproject/contracts";
import PoolManagerABI from "../../abis/PoolManager.json";
import useConnectors from "./useConnectors";
import { PoolManager } from "../../abis/types/PoolManager";

const POOL_MANAGER_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

function usePoolManager() {
  const connectors = useConnectors();
  const [poolManager, setPoolManager] = useState<null | PoolManager>(null);

  useEffect(() => {
    if (connectors && connectors.user) {
      const poolManagerContract = new Contract(
        POOL_MANAGER_ADDRESS,
        PoolManagerABI.abi,
        connectors.user.provider as any
      );
      setPoolManager(poolManagerContract as any as PoolManager);
    }
  }, [connectors]);

  return {
    poolManager,
  };
}

export default usePoolManager;
