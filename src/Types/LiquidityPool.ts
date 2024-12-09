import { ChainId } from '@ryze-blockchain/ethereum'

export type HubLiquidityPool = {
    id: number
    chainId: ChainId
    positionManager: string
    address: string
    token0: string
    token1: string
    fee: string
    liquidity: string
    sqrtPriceX96: string
    tick: string
    totalLiquidityUSD: string
}
