import { ChainIds } from '@ryze-blockchain/ethereum'
import { tokenAddresses } from '~/src/constants/tokens/addresses'

export const mainStablecoins = {
    [ChainIds.ARBITRUM]: tokenAddresses[ChainIds.ARBITRUM].usdc,
    [ChainIds.BNB]: tokenAddresses[ChainIds.BNB].usdt,
    [ChainIds.BNB_TESTNET]: tokenAddresses[ChainIds.BNB_TESTNET].usdt,
    [ChainIds.POLYGON]: tokenAddresses[ChainIds.POLYGON]['usdc.e'],
} as const

export const stablecoins = {
    [ChainIds.ARBITRUM]: [
        tokenAddresses[ChainIds.ARBITRUM].usdc,
        tokenAddresses[ChainIds.ARBITRUM].usdt,
    ],
    [ChainIds.BNB]: [
        tokenAddresses[ChainIds.BNB].usdc,
        tokenAddresses[ChainIds.BNB].usdt,
        tokenAddresses[ChainIds.BNB].dai,
    ],
    [ChainIds.BNB_TESTNET]: [
        tokenAddresses[ChainIds.BNB_TESTNET].usdc,
        tokenAddresses[ChainIds.BNB_TESTNET].usdt,
        tokenAddresses[ChainIds.BNB_TESTNET].dai,
    ],
    [ChainIds.POLYGON]: [
        tokenAddresses[ChainIds.POLYGON]['usdc.e'],
        tokenAddresses[ChainIds.POLYGON].usdc,
        tokenAddresses[ChainIds.POLYGON].usdt,
        tokenAddresses[ChainIds.POLYGON].dai,
    ],
} as const
