import { type AddressLike, AbiCoder } from 'ethers'
import { unwrapAddressLike } from '~/src/Helpers'
import { ZapProtocol } from '~/src/Types'

export const ZapperFunctionSignatures = {
    SWAP: 'swap(bytes)',
    ZAP: 'zap(bytes)',
} as const

export type ZapperFunctionSignature = typeof ZapperFunctionSignatures[keyof typeof ZapperFunctionSignatures]

export class Zapper {
    public static async encodeSwap(inputToken: AddressLike, amount: bigint, swapBytes: string) {
        return AbiCoder.defaultAbiCoder().encode(
            // Swapper.SwapData
            ['tuple(address,uint,bytes)'],
            [
                [
                    await unwrapAddressLike(inputToken),
                    amount,
                    swapBytes,
                ],
            ],
        )
    }

    /**
     * CANNOT BE USED WITH BETA VERSION OF CONTRACTS SINCE THEY EXPECT THE FUNCTION SIGNATURE TO BE INCLUDED
     *
     * Encodes the data sent to ZapManager's callProtocol function.
     */
    public static async encodeProtocolCall(
        protocol: ZapProtocol,
        inputToken: AddressLike,
        outputToken: AddressLike,
        zapperFunctionSignature: ZapperFunctionSignature,
        data: string,
    ) {
        return AbiCoder.defaultAbiCoder().encode(
            // ZapManager.ProtocolCall
            ['tuple(string,address,address,string,bytes)'],
            [
                [
                    protocol,
                    await unwrapAddressLike(inputToken),
                    await unwrapAddressLike(outputToken),
                    zapperFunctionSignature,
                    data,
                ],
            ],
        )
    }
}
