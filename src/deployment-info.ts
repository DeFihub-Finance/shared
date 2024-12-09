import { Chain, type ChainId, ChainIds, EthErrors } from '@ryze-blockchain/ethereum'
import { hubContracts } from '~/src/constants/hub-contracts'
import { mainStablecoins, safes, wrappedNatives } from '~/src/constants'

export interface Addresses {
    GnosisSafe: string
    Stablecoin: string
    WrappedEthereum: string
    StrategyInvestor: string
    StrategyPositionManager: string
    StrategyManager: string
    SubscriptionManager: string
    DollarCostAverage: string
    VaultManager: string
    LiquidityManager: string
    BuyProduct: string
    ZapManager: string
}

export type HubAddress = keyof Addresses

function objectValuesToLowercase(
    rawAddresses: Record<HubAddress, string>,
): Record<HubAddress, string> {
    return Object.entries(rawAddresses)
        .reduce(
            (acc, [
                key,
                value,
            ]) => ({ ...acc, [key]: value.toLowerCase() }),
            {} as Record<HubAddress, string>,
        )
}

export const availableChains = [
    ChainIds.ARBITRUM,
    ChainIds.BNB,
    ChainIds.POLYGON,
]

type AvailableChain = typeof availableChains[0]

const addressMap = Chain.createChainMap({
    chainIds: availableChains,
    initialValueCallback: chainId => {
        // safe to use "as" here because we know that chainId is one of the availableChains
        const typedChainId: AvailableChain = chainId as AvailableChain

        return objectValuesToLowercase({
            GnosisSafe: safes[typedChainId],
            Stablecoin: mainStablecoins[typedChainId],
            WrappedEthereum: wrappedNatives[typedChainId],
            ...hubContracts,
        })
    },
})

export const {
    mainnets: availableMainnets,
    testnets: availableTestnets,
} = Chain.splitMainnetsAndTestnets(availableChains)

export function getAddresses(chainId: ChainId): Addresses | undefined {
    return addressMap[chainId]
}

export function getAddress(chainId: ChainId, name: HubAddress): string | undefined {
    return addressMap[chainId]?.[name].toLowerCase()
}

export function getAddressOrFail(chainId: ChainId, name: HubAddress): string {
    const address = getAddress(chainId, name)

    if (!address)
        throw new Error(`No address for ${ name } on chain ${ chainId }`)

    return address
}

export function getSafeOrFail(chainId: ChainId): string {
    const safe = safes[chainId as keyof typeof safes]

    if (!safe)
        throw new Error(EthErrors.UNSUPPORTED_CHAIN)

    return safe
}

export function getMainStablecoinOrFail(chainId: ChainId): string {
    const stablecoin = mainStablecoins[chainId as keyof typeof mainStablecoins]

    if (!stablecoin)
        throw new Error(EthErrors.UNSUPPORTED_CHAIN)

    return stablecoin
}
