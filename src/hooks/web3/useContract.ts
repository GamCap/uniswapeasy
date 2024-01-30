import { Contract } from '@ethersproject/contracts'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import { getContract } from '../../utils/getContract'
import  PoolManagerJson  from "../../abis/PoolManager.json";
import ERC20_ABI from "../../abis/erc20.json";
import { Erc20 } from '../../abis/types'
const {abi : PoolManagerABI} = PoolManagerJson

export function useContract<T extends Contract = Contract>(
    addressOrAddressMap: string | { [chainId: number]: string } | undefined,
    ABI: any,
    withSignerIfPossible = true
  ): T | null {
    const { provider, account, chainId } = useWeb3React()
  
    return useMemo(() => {
      if (!addressOrAddressMap || !ABI || !provider || !chainId) return null
      let address: string | undefined
      if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
      else address = addressOrAddressMap[chainId]
      if (!address) return null
      try {
        return getContract(address, ABI, provider, withSignerIfPossible && account ? account : undefined)
      } catch (error) {
        console.error('Failed to get contract', error)
        return null
      }
    }, [addressOrAddressMap, ABI, provider, chainId, withSignerIfPossible, account]) as T
  }


  export function useTestnetContract(){
    return useContract("0x3A9D48AB9751398BbFa63ad67599Bb04e4BdF98b",PoolManagerABI, false);
  }

  export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
    return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
  }