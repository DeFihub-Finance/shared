import type { BigNumber, ChainId } from '@ryze-blockchain/ethereum'

export interface ERC20Json {
    chainId: ChainId
    address: string
    name: string
    symbol: string
    decimals: number
    image: string
}

export interface ERC20Priced extends ERC20Json {
    price: BigNumber
}

export interface ERC20PricedJson extends ERC20Json {
    price: string
}

export interface ERC20PositionJson {
    chainId: ChainId
    tokenAddress: string
    balance: string
}
