import { Contract } from "ethers";
import { useState, useEffect, useRef } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { Result } from "ethers/lib/utils";

interface Slot0 {
  result?: Result;
  loading?: boolean;
  valid?: boolean;
}

interface Liquidity {
  result?: Result;
  loading?: boolean;
  valid?: boolean;
}

export function usePoolData(
  latestBlock?: number,
  poolManagerContract?: Contract,
  provider?: Web3Provider,
  chainId?: number,
  id?: string
) {
  const [data, setData] = useState<{ slot0?: Slot0; liquidity?: Liquidity }>(
    {}
  );
  const lastFetchedBlock = useRef<number | undefined>();
  const lastData = useRef<{ slot0?: Slot0; liquidity?: Liquidity }>({});
  useEffect(() => {
    async function fetchData() {
      if (!poolManagerContract || !id || !provider || !chainId) {
        setData({});
        return;
      }

      const slot0Data = poolManagerContract.interface.encodeFunctionData(
        "getSlot0",
        [id]
      );
      const liquidityData = poolManagerContract.interface.encodeFunctionData(
        "getLiquidity(bytes32)",
        [id]
      );

      try {
        setData({
          slot0: { result: undefined, loading: true, valid: true },
          liquidity: { result: undefined, loading: true, valid: true },
        });
        const [resolvedSlot0, resolvedLiquidity] = await Promise.all([
          provider.call({ to: poolManagerContract.address, data: slot0Data }),
          provider.call({
            to: poolManagerContract.address,
            data: liquidityData,
          }),
        ]);

        const resolvedSlot0Decoded =
          poolManagerContract.interface.decodeFunctionResult(
            "getSlot0",
            resolvedSlot0
          );
        const resolvedLiquidityDecoded =
          poolManagerContract.interface.decodeFunctionResult(
            "getLiquidity(bytes32)",
            resolvedLiquidity
          );

        // Update data and cache it in the ref
        const newData = {
          slot0: {
            result: resolvedSlot0Decoded,
            loading: false,
            valid: true,
          },
          liquidity: {
            result: resolvedLiquidityDecoded,
            loading: false,
            valid: true,
          },
        };
        setData(newData);
        lastData.current = newData;

        lastFetchedBlock.current = latestBlock;
      } catch (error) {
        console.error("Error fetching pool data:", error);
        // You could also handle the error state here, if necessary
      }
    }

    // Check if we need to fetch the data: either data is missing or the block has changed
    if (
      lastFetchedBlock.current !== latestBlock ||
      !lastData.current?.slot0 ||
      !lastData.current?.liquidity
    ) {
      fetchData();
    }
  }, [poolManagerContract, id, provider, chainId, latestBlock]);

  //console last data, current data, last fetched block and latest block

  useEffect(() => {
    console.log("lastData", lastData.current);
    console.log("data", data);
    console.log("lastFetchedBlock", lastFetchedBlock.current);
    console.log("latestBlock", latestBlock);
  }, [data, latestBlock, lastFetchedBlock, lastData]);

  // Return the latest data, falling back to the ref if the state hasn't updated, showing the lastData while loading to prevent flickering
  return {
    slot0:
      data.slot0?.loading && lastData.current.slot0
        ? lastData.current.slot0
        : data.slot0,
    liquidity:
      data.liquidity?.loading && lastData.current.liquidity
        ? lastData.current.liquidity
        : data.liquidity,
  };
}
