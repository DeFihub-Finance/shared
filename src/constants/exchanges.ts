import { ChainIds, ChainMap } from '@ryze-blockchain/ethereum'
import { HubExchange, ZapProtocols } from '~/src/Types'

const baseUniswapV3 = {
    name: 'Uniswap V3',
    image: 'https://tokens-data.1inch.io/images/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png',
    feeTiers: [
        100,
        500,
        3_000,
        10_000,
    ],
    protocol: ZapProtocols.UniswapV3,
}

// pancake uses the same addresses for every available chain except for zkSync
const pancakeAllChainsButZkSync = {
    name: 'PancakeSwap V3',
    factory: '0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865',
    positionManager: '0x46a15b0b27311cedf172ab29e4f4766fbe7f4364',
    quoter: '0xb048bbc1ee6b733fffcfb9e9cef7375518e25997',
    feeTiers: [
        100,
        500,
        2_500,
        10_000,
    ],
    image: 'https://tokens-data.1inch.io/images/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82.png',
    protocol: ZapProtocols.PancakeV3,
}

/**
 * Maps exchange factories chain and address to its metadata.
 */
export const exchangesMeta: ChainMap<HubExchange[]> = {
    [ChainIds.ARBITRUM]: [
        {
            ...baseUniswapV3,
            factory: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
            positionManager: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
            router: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45', // SwapRouter2
            quoter: '0x61ffe014ba17989e743c5f6cb21bf9697530b21e',
        },
        {
            ...pancakeAllChainsButZkSync,
            router: '0x32226588378236fd0c7c4053999f88ac0e5cac77',
        },
    ],
    [ChainIds.BNB]: [
        {
            ...baseUniswapV3,
            factory: '0xdb1d10011ad0ff90774d0c6bb92e5c5c8b4461f7',
            positionManager: '0x7b8a01b39d58278b5de7e48c8449c9f4f5170613',
            router: '0xb971ef87ede563556b2ed4b1c0b0019111dd85d2', // SwapRouter2
            quoter: '0x78d78e420da98ad378d7799be8f4af69033eb077',
        },
        {
            ...pancakeAllChainsButZkSync,
            router: '0x13f4ea83d0bd40e75c8222255bc855a974568dd4',
        },
    ],
    [ChainIds.BNB_TESTNET]: [
        {
            ...baseUniswapV3,
            factory: '0xf4e303a45bbcdf5883fe78220f26c0fcc661556a',
            positionManager: '0x33f0264480e7168954a4cb50f6eeb43553386d24',
            router: '0x80e01d482d5ac3e32200f1abc5aa5eac2fa23869', // todo deprecated v1 router, use router2
            quoter: '', // not deployed
        },
    ],
    [ChainIds.POLYGON]: [
        {
            ...baseUniswapV3,
            factory: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
            positionManager: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
            router: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
            quoter: '0xb27308f9f90d607463bb33ea1bebb41c27ce5ab6',
        },
        // TODO add quickswap when we can support v1 router or deploy the v2 router ourselves
    ],
}
