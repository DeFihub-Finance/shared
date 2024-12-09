import type { BigNumber, ChainId, ChainMap } from '@ryze-blockchain/ethereum'
import type { DailyReturnJson } from '~/src/Models'

export interface StrategyJson {
    /** Contract Strategy ID */
    id: string
    chainId: ChainId

    name: string
    bio: string
    strategist: string
    isHot: boolean

    totalDepositAmount: string
    depositCount: string
    apr: string
    dailyReturns: DailyReturnJson[]

    dcaInvestments: {
        poolId: string
        swaps: string
        percentage: string
    }[]
    vaultInvestments: {
        vault: string
        percentage: string
    }[]
    liquidityInvestments: {
        id: number
        usePercentageBounds: boolean
        lowerBound: string
        upperBound: string
        percentage: string
    }[],
    buyInvestments: {
        token: string
        percentage: string
    }[]
}

export interface StrategyMetadataJson {
    name: string
    bio: string
    hash: string
}

export type StrategyWithdrawnAmountByPosition = ChainMap<Record<number, BigNumber>>
export type StrategyWithdrawnAmountByPositionJson = ChainMap<Record<number, string>>

export type StrategyPositionJson = {
    /** Contract Position ID */
    positionId: number
    /** Contract Strategy ID */
    strategyId: number
    inputAmount: string
    withdrawnAmountUsd: string
    closed: boolean
}

export type StrategyPositionMap = ChainMap<StrategyPositionJson[]>
