import { Signer, Signature, AddressLike } from 'ethers'
import { ChainId } from '@ryze-blockchain/ethereum'
import { unwrapAddressLike } from './unwrap-address-like'
import { SubscriptionManager } from '~/src/Types'

export class SubscriptionSigner {
    constructor(
        private subscriptionManager: AddressLike,
        private signer: Signer,
    ) {}

    async signSubscriptionPermit(
        user: AddressLike,
        deadline: number,
        chainId: ChainId,
    ): Promise<SubscriptionManager.PermitStruct> {
        const domain = {
            name: 'defihub.fi',
            version: '1',
            chainId: chainId,
            verifyingContract: await unwrapAddressLike(this.subscriptionManager),
        }

        const types = {
            SubscriptionPermit: [
                { type: 'address', name: 'user' },
                { type: 'uint256', name: 'deadline' },
            ],
        }

        const message = {
            user: await unwrapAddressLike(user),
            deadline,
        }

        const signature = Signature.from(
            await this.signer.signTypedData(domain, types, message),
        )

        return {
            deadline,
            r: signature.r,
            s: signature.s,
            v: signature.v,
        }
    }
}

