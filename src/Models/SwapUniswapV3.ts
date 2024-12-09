import { PathUniswapV3, PathUniswapV3JSON } from '~/src/Models/PathUniswapV3'
import { ZapProtocol } from '~/src/Types'

export interface SwapUniswapV3JSON {
    protocol: ZapProtocol
    path: PathUniswapV3JSON
    inputAmount: string
    outputAmount: string
}

export class SwapUniswapV3 {
    public constructor(
        public readonly protocol: ZapProtocol,
        public readonly path: PathUniswapV3,
        public readonly inputAmount: bigint,
        public readonly outputAmount: bigint,
    ) {
    }

    public static fromJSON(json: SwapUniswapV3JSON): SwapUniswapV3 {
        return new SwapUniswapV3(
            json.protocol,
            PathUniswapV3.fromJSON(json.path),
            BigInt(json.inputAmount),
            BigInt(json.outputAmount),
        )
    }

    public async toJSON() {
        return {
            protocol: this.protocol,
            path: await this.path.toJSON(),
            inputAmount: this.inputAmount.toString(),
            outputAmount: this.outputAmount.toString(),
        }
    }
}
