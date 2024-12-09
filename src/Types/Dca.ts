import { ChainId } from '@ryze-blockchain/ethereum'

export interface HubDcaPool {
    chainId: ChainId
    poolId: number
    inputToken: string
    outputToken: string
    performedSwaps: number
}
