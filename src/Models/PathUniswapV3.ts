import { unwrapAddressLike } from '~/src/Helpers'
import { AddressLike, BigNumberish } from 'ethers'
import { solidityPacked } from 'ethers'

export interface PathUniswapV3JSON {
    inputToken: string
    hops: {
        fee: string,
        token: string
    }[]
}

export class PathUniswapV3 {
    public constructor(
        public readonly inputToken: AddressLike,
        public readonly hops: {
            fee: BigNumberish
            token: AddressLike
        }[],
    ) {
        if (!hops.length)
            throw new Error('PathUniswapV3: path must have at least one hop')
    }

    /**
     * Encodes the path for UniswapV3
     *
     * @warning This updating this method can break all interactions with UniswapV3
     */
    public async encodedPath(): Promise<string> {
        let path = await unwrapAddressLike(this.inputToken)

        for (const hop of this.hops) {
            path += solidityPacked(
                ['uint24', 'address'],
                [hop.fee, await unwrapAddressLike(hop.token)],
            ).slice(2)
        }

        return path
    }

    public get outputToken(): AddressLike {
        return this.hops[this.hops.length - 1].token
    }

    public static fromJSON(json: PathUniswapV3JSON): PathUniswapV3 {
        return new PathUniswapV3(
            json.inputToken,
            json.hops.map(hop => ({
                fee: BigInt(hop.fee),
                token: hop.token,
            })),
        )
    }

    public async toJSON() {
        return {
            inputToken: await unwrapAddressLike(this.inputToken),
            hops: await Promise.all(
                this.hops.map(async hop => ({
                    fee: hop.fee.toString(),
                    token: await unwrapAddressLike(hop.token),
                })),
            ),
        }
    }
}
