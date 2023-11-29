import { SupportedChainId } from 'constants/chains'

export function supportedChainId(chainId: number | undefined): SupportedChainId | undefined {
  if (typeof chainId === 'number' && chainId in SupportedChainId) {
    return chainId
  }
  return undefined
}