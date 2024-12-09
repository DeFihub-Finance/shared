import type { ChainId, ChainMap } from '@ryze-blockchain/ethereum'
import type { ERC20Json, PartialRecord } from '~/src/Types'

export type ERC20JsonAddressMap<
    T extends ERC20Json = ERC20Json
> = PartialRecord<string, T>
export type ERC20JsonChainAndAddressMap<
    T extends ERC20Json = ERC20Json
> = PartialRecord<ChainId, ERC20JsonAddressMap<T>>

export function reduceTokensByChainAndAddress<T extends ERC20Json>(
    tokens: (T | undefined)[],
): ERC20JsonChainAndAddressMap<T> {
    return tokens.reduce<ERC20JsonChainAndAddressMap<T>>(
        (acc, token) => {
            if (!token)
                return acc

            const chainTokens = acc[token.chainId]

            if (!chainTokens) {
                acc[token.chainId] = {
                    [token.address]: token,
                }
            }
            else {
                chainTokens[token.address] = token
            }

            return acc
        },
        {},
    )
}

export function reduceTokensByAddress<T extends ERC20Json>(
    tokens: (T | undefined)[],
): ERC20JsonAddressMap<T> {
    return tokens.reduce<ERC20JsonAddressMap<T>>(
        (acc, token) => {
            if (token)
                acc[token.address] = token

            return acc
        },
        {},
    )
}

export function reduceByChainId<T extends { chainId: ChainId }>(
    items: (T | undefined)[],
): Partial<ChainMap<T[]>> {
    return items.reduce<Partial<ChainMap<T[]>>>(
        (acc, currentItem) => {
            if (!currentItem)
                return acc

            const chainPositions = acc[currentItem.chainId]

            if (!chainPositions)
                acc[currentItem.chainId] = [currentItem]
            else
                chainPositions.push(currentItem)

            return acc
        },
        {},
    )
}
