import { useEffect, useState } from "react";
import { Contract } from "@ethersproject/contracts";
import PoolManagerABI from "../../abis/PoolManager.json";
import useConnectors from "./useConnectors";

const POOL_MANAGER_ADDRESS = "0x3A9D48AB9751398BbFa63ad67599Bb04e4BdF98b";

function usePoolManager() {
  const connectors = useConnectors();
  const [poolManager, setPoolManager] = useState<null | Contract>(null);

  useEffect(() => {
    if (connectors && connectors.user) {
      const poolManagerContract = new Contract(
        POOL_MANAGER_ADDRESS,
        PoolManagerABI.abi,
        connectors.user.provider as any
      );
      setPoolManager(poolManagerContract);
    }
  }, [connectors]);

  return {
    poolManager,
  };
}

export default usePoolManager;
