import { Pool as _Pool } from '@uniswap/v3-sdk'
import { Token } from '@uniswap/sdk-core'
import { BigNumber } from '@ryze-blockchain/ethereum'
import { TICK_SPACINGS } from '../constants'
import { ERC20Json } from '../Types'
import { UniswapV3 } from '../Helpers'

type UniswapTokenJson = Pick<ERC20Json, 'address' | 'chainId' | 'decimals'>

// Custom `Pool` class to override the tick spacing getter to work with any exchange.
export class Pool extends _Pool {
    constructor(
        tokenA: UniswapTokenJson,
        tokenB: UniswapTokenJson,
        fee: BigNumber,
        sqrtRatioX96: bigint,
        liquidity: bigint,
        tickCurrent: bigint,
    ) {
        super(
            new Token(tokenA.chainId, tokenA.address, tokenA.decimals),
            new Token(tokenB.chainId, tokenB.address, tokenB.decimals),
            fee.shiftedBy(UniswapV3.FEE_DECIMALS).toNumber(),
            sqrtRatioX96.toString(),
            liquidity.toString(),
            Number(tickCurrent),
        )
    }

    public override get tickSpacing(): number {
        const tickSpacing = TICK_SPACINGS[this.fee]

        if (!tickSpacing)
            throw new Error(`No tick spacing found for fee ${ this.fee }.`)

        return tickSpacing
    }
}
