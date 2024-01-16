import { Contract } from '@ethersproject/contracts'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import { getContract } from '../../utils/getContract'
import  PoolManagerJson  from "../../abis/PoolManager.json";

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
    return useContract("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",PoolManagerABI, false);
  }