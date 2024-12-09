import { ChainIds } from '@ryze-blockchain/ethereum'
import { tokenAddresses } from '~/src/constants/tokens/addresses'

export const connectors = {
    [ChainIds.ARBITRUM]: [
        tokenAddresses[ChainIds.ARBITRUM].usdc,
        tokenAddresses[ChainIds.ARBITRUM].weth,
        tokenAddresses[ChainIds.ARBITRUM].wbtc,
    ],
    [ChainIds.BNB]: [
        tokenAddresses[ChainIds.BNB].usdt,
        tokenAddresses[ChainIds.BNB].wbnb,
        tokenAddresses[ChainIds.BNB].btcb,
        tokenAddresses[ChainIds.BNB].weth,
    ],
    [ChainIds.BNB_TESTNET]: [
        tokenAddresses[ChainIds.BNB_TESTNET].usdt,
        tokenAddresses[ChainIds.BNB_TESTNET].wbnb,
        tokenAddresses[ChainIds.BNB_TESTNET].btcb,
        tokenAddresses[ChainIds.BNB_TESTNET].weth,
    ],
    [ChainIds.POLYGON]: [
        tokenAddresses[ChainIds.POLYGON]['usdc.e'],
        tokenAddresses[ChainIds.POLYGON].weth,
        tokenAddresses[ChainIds.POLYGON].wmatic,
    ],
} as const
