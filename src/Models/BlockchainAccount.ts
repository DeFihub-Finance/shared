import type { ChainId } from '@ryze-blockchain/ethereum'
import { isAddress } from 'ethers'

export interface BlockchainAccountJson {
    chainId: ChainId
    address: string
}

export class BlockchainAccount implements BlockchainAccountJson {
    public readonly chainId: ChainId
    public readonly address: string

    constructor(chain: ChainId, address: string) {
        if (!isAddress(address))
            throw new Error(`Invalid account address: ${ address }`)

        this.chainId = chain
        this.address = address.toLowerCase()
    }
}
