import type { AddressLike } from 'ethers'

export async function unwrapAddressLike(addressLike: AddressLike): Promise<string> {
    const awaitedAddress = await addressLike

    if (typeof awaitedAddress === 'string')
        return awaitedAddress

    return awaitedAddress.getAddress()
}
