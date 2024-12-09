import { Chain, ChainId, ChainIds, ChainMap } from '@ryze-blockchain/ethereum'
import { NATIVE, tokenAddresses, TokenKeys } from '~/src/constants/tokens/addresses'

const defihubAPI = 'https://v1.api.defihub.fi'

function oneInch(
    address: string,
    { chainId, imageType }: { chainId?: ChainId, imageType?: 'png' | 'webp' } = { imageType: 'png' },
) {
    return `https://tokens-data.1inch.io/images/${ chainId ? chainId + '/' : '' }${ address }.${ imageType }`
}

export const imagesByName: Record<TokenKeys, string> = {
    // Stables
    usdc: oneInch(tokenAddresses[ChainIds.ETH].usdc),
    'usdc.e': oneInch(tokenAddresses[ChainIds.ETH].usdc),
    usdt: oneInch(tokenAddresses[ChainIds.ETH].usdt),
    dai: oneInch(tokenAddresses[ChainIds.ETH].dai),

    // Chains
    eth: oneInch(NATIVE),
    weth: oneInch(tokenAddresses[ChainIds.ETH].weth),
    wsteth: oneInch(tokenAddresses[ChainIds.ETH].wsteth),
    wbtc: oneInch(tokenAddresses[ChainIds.ETH].wbtc),
    btcb: oneInch(tokenAddresses[ChainIds.BNB].btcb),
    arb: oneInch(tokenAddresses[ChainIds.ETH].arb),
    bnb: oneInch(tokenAddresses[ChainIds.BNB].wbnb),
    wbnb: oneInch(tokenAddresses[ChainIds.BNB].wbnb),
    matic: oneInch(tokenAddresses[ChainIds.BNB].matic),
    wmatic: oneInch(tokenAddresses[ChainIds.BNB].matic),
    xrp: oneInch(tokenAddresses[ChainIds.BNB].xrp),
    sol: oneInch(tokenAddresses[ChainIds.BNB].sol),
    cro: oneInch(tokenAddresses[ChainIds.ETH].cro),
    om: defihubAPI + '/images/om.svg',

    // DeFi
    uni: oneInch(tokenAddresses[ChainIds.ETH].uni),
    crv: oneInch(tokenAddresses[ChainIds.ETH].crv),
    pendle: oneInch(tokenAddresses[ChainIds.ETH].pendle),
    lido: oneInch(tokenAddresses[ChainIds.ETH].lido),
    aave: oneInch(tokenAddresses[ChainIds.ETH].aave),
    gmx: oneInch(tokenAddresses[ChainIds.ARBITRUM].gmx),
    cake: oneInch(tokenAddresses[ChainIds.BNB].cake),
    alpaca: oneInch(tokenAddresses[ChainIds.BNB].alpaca),
    xvs: oneInch(tokenAddresses[ChainIds.BNB].xvs),
    ldo: oneInch(tokenAddresses[ChainIds.POLYGON].ldo),
    mkr: oneInch(tokenAddresses[ChainIds.ETH].mkr),
    comp: oneInch(tokenAddresses[ChainIds.ETH].comp),
    snx: oneInch(tokenAddresses[ChainIds.POLYGON].snx),
    '1inch': oneInch(tokenAddresses[ChainIds.ETH]['1inch']),
    w: oneInch(tokenAddresses[ChainIds.ETH].w, { chainId: ChainIds.ETH, imageType: 'webp' }),

    // Meme
    pepe: oneInch(tokenAddresses[ChainIds.ETH].pepe),
    shib: oneInch(tokenAddresses[ChainIds.ETH].shib),
    doge: oneInch(tokenAddresses[ChainIds.BNB].doge),
    ape: oneInch(tokenAddresses[ChainIds.ETH].ape),

    // Alts
    grt: oneInch(tokenAddresses[ChainIds.ETH].grt),
    link: oneInch(tokenAddresses[ChainIds.ETH].link),
    sand: oneInch(tokenAddresses[ChainIds.POLYGON].sand),
    mana: oneInch(tokenAddresses[ChainIds.ETH].mana),
    rndr: defihubAPI + '/images/render.svg',
    fet: oneInch(tokenAddresses[ChainIds.ETH].fet),
    reth: oneInch(tokenAddresses[ChainIds.ETH].reth),
    paxg: oneInch(tokenAddresses[ChainIds.ETH].paxg),
    iotx: oneInch(tokenAddresses[ChainIds.ETH].iotx),
    zro: oneInch(tokenAddresses[ChainIds.ETH].zro, { chainId: ChainIds.ETH, imageType: 'webp' }),
}

export const imagesByBlockchainAccount = Object
    .entries(tokenAddresses)
    .reduce<ChainMap<Partial<Record<string, string>>>>(
        (acc, [
            chainId,
            tokens,
        ]) => {
            acc[Chain.parseChainIdOrFail(chainId)] = Object
                .entries(tokens)
                .reduce<Partial<Record<string, string>>>(
                    (acc, [
                        name,
                        address,
                    ]) => {
                        acc[address] = imagesByName[name as keyof typeof imagesByName]

                        return acc
                    },
                    {},
                )

            return acc
        },
        {},
    )
