import { ChainId, ChainIds, ChainMap } from '@ryze-blockchain/ethereum'
import { NATIVE, tokenAddresses } from '~/src/constants/tokens/addresses'
import { ERC20Json } from '~/src/Types'
import { imagesByName } from '~/src/constants/tokens/images'

function getNativeToken(chainId: ChainId, name: string, symbol: string, image: string): ERC20Json {
    return {
        chainId,
        address: NATIVE,
        name,
        symbol,
        decimals: 18,
        image,
    }
}

function getNativeEth(ChainId: ChainId) {
    return getNativeToken(ChainId, 'Ethereum', 'ETH', imagesByName.eth)
}

export const wrappedNatives = {
    [ChainIds.ETH]: tokenAddresses[ChainIds.ETH].weth,
    [ChainIds.ARBITRUM]: tokenAddresses[ChainIds.ARBITRUM].weth,
    [ChainIds.BNB]: tokenAddresses[ChainIds.BNB].wbnb,
    [ChainIds.BNB_TESTNET]: tokenAddresses[ChainIds.BNB_TESTNET].wbnb,
    [ChainIds.POLYGON]: tokenAddresses[ChainIds.POLYGON].wmatic,
} as const

export const nativeTokens: ChainMap<ERC20Json> = {
    [ChainIds.ETH]: getNativeEth(ChainIds.ETH),
    [ChainIds.ARBITRUM]: getNativeEth(ChainIds.ARBITRUM),
    [ChainIds.OPTIMISM]: getNativeEth(ChainIds.OPTIMISM),
    [ChainIds.BASE]: getNativeEth(ChainIds.BASE),
    [ChainIds.BLAST]: getNativeEth(ChainIds.BLAST),
    [ChainIds.BNB]: getNativeToken(ChainIds.BNB, 'Binance Coin', 'BNB', imagesByName.bnb),
    [ChainIds.POLYGON]: getNativeToken(ChainIds.POLYGON, 'Polygon', 'POL', imagesByName.matic),
    [ChainIds.CRONOS]: getNativeToken(ChainIds.CRONOS, 'Cronos', 'CRO', imagesByName.cro),
}
