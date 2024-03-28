import { useEffect, useState } from "react";
import { Contract } from "@ethersproject/contracts";
import PoolManagerABI from "../../abis/PoolManager.json";
import useConnectors from "./useConnectors";

const POOL_MANAGER_ADDRESS = "0xf7a031A182aFB3061881156df520FE7912A51617";

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
