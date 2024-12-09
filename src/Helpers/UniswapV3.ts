import JSBI from 'jsbi'
import { parseEther, ZeroAddress, AddressLike } from 'ethers'
import { Fraction, Price, Token } from '@uniswap/sdk-core'
import {
    Position,
    TickMath,
    encodeSqrtRatioX96,
    nearestUsableTick,
    priceToClosestTick,
    tickToPrice,
} from '@uniswap/v3-sdk'
import { BigNumber } from '@ryze-blockchain/ethereum'
import { Pool } from '~/src/Models'
import { Slippage } from '~/src/Helpers/Slippage'
import { MAX_UINT_128, TICK_SPACINGS, type ExchangeFeeAmount } from '~/src/constants'
import { ERC20Json, ERC20Priced, NonFungiblePositionManager } from '~/src/Types'

export class UniswapV3 {
    public static readonly FEE_DECIMALS = 6
    public static readonly PRICE_PERCENTAGE_DECIMALS = 6

    /**
     * Calculates the token amounts and price range ticks needed to mint a Uniswap V3 position.
     *
     * @param {ERC20Priced} stablecoin - The deposit stable token.
     * @param {BigNumber} stableAmount - The deposit stable amount parsed.
     * @param {Pool} pool - The pool used to mint the position.
     * @param {BigNumber} priceToken0 - The price of token0 in USD.
     * @param {BigNumber} priceToken1 - The price of token1 in USD.
     * @param {BigNumber} lowerBound - The lower bound as a percentage offset (expressed as a decimal) or tick value.
     * @param {BigNumber} upperBound - The upper bound as a percentage offset (expressed as a decimal) or tick value.
     * @param {boolean} usePercentageBounds - Determines if bounds are percentage offsets (true) or tick values (false).
     *
     * @returns The `getMintPositionInfo` function returns an object containing the following properties:
     * - `tickLower`: The lower tick of the price range
     * - `tickUpper`: The upper tick of the price range
     * - `amount0`: The amount of token 0 to be minted
     * - `amount1`: The amount of token 1 to be minted
     * - `swapAmountToken0`: The amount of stable that needs to be swapped to amount0
     * - `swapAmountToken1`: The amount of stable that needs to be swapped to amount1
     */
    public static getMintPositionInfo(
        stablecoin: ERC20Priced,
        stableAmount: BigNumber,
        pool: Pool,
        priceToken0: BigNumber,
        priceToken1: BigNumber,
        lowerBound: BigNumber,
        upperBound: BigNumber,
        usePercentageBounds: boolean,
    ) {
        const depositAmountUsd = stablecoin.price.times(stableAmount)

        let tickLower: number, tickUpper: number

        if (usePercentageBounds) {
            ({ tickLower, tickUpper } = UniswapV3.getPriceRangeTicks(
                pool,
                lowerBound,
                upperBound,
            ))
        }
        else {
            tickLower = lowerBound.toNumber()
            tickUpper = upperBound.toNumber()
        }

        const { amount0, amount1 } = UniswapV3.getMintTokenAmounts(
            depositAmountUsd,
            pool,
            tickLower,
            tickUpper,
            priceToken0,
            priceToken1,
        )

        const swapAmountToken0 = BigInt(
            priceToken0.times(amount0.toString())
                .shiftedBy(stablecoin.decimals - pool.token0.decimals)
                .toFixed(0),
        )
        const swapAmountToken1 = BigInt(
            priceToken1.times(amount1.toString())
                .shiftedBy(stablecoin.decimals - pool.token1.decimals)
                .toFixed(0),
        )

        return {
            tickLower,
            tickUpper,
            amount0,
            amount1,
            swapAmountToken0,
            swapAmountToken1,
        }
    }

    public static sortTokens<Token extends ERC20Priced>(
        tokenA: Token,
        tokenB: Token,
    ) {
        if (tokenA.address.toLowerCase() > tokenB.address.toLowerCase()) {
            [
                tokenA,
                tokenB,
            ] = [tokenB, tokenA]
        }

        return { token0: tokenA, token1: tokenB }
    }

    /**
     * Returns the minimum token0 and token1 amounts that must be sent in order to
     * safely mint a position using the total provided amount of stable.
     *
     * @param {BigNumber} depositAmountUsd - The deposit amount in USD.
     * @param {Pool} pool - The pool used to mint the position.
     * @param {number} tickLower - The target tick lower.
     * @param {number} tickUpper - The target tick upper.
     * @param {BigNumber} price0 - The price of token0 in USD.
     * @param {BigNumber} price1 - The price of token1 in USD.
     *
     * @returns Returns an object with `amount0` and `amount1`.
     */
    private static getMintTokenAmounts(
        depositAmountUsd: BigNumber,
        pool: Pool,
        tickLower: number,
        tickUpper: number,
        price0: BigNumber,
        price1: BigNumber,
    ): { amount0: bigint, amount1: bigint } {
        if (pool.tickCurrent <= tickLower) {
            return {
                amount0: BigInt(
                    depositAmountUsd
                        .shiftedBy(pool.token0.decimals)
                        .div(price0)
                        .toFixed(0),
                ),
                amount1: BigInt(0),
            }
        }

        if (pool.tickCurrent >= tickUpper) {
            return {
                amount0: BigInt(0),
                amount1: BigInt(
                    depositAmountUsd
                        .shiftedBy(pool.token1.decimals)
                        .div(price1)
                        .toFixed(0),
                ),
            }
        }

        const { amount0, amount1 } = Position.fromAmount0({
            pool,
            tickLower,
            tickUpper,
            amount0: parseEther('1000').toString(), // Can be any number
            useFullPrecision: true,
        }).mintAmounts

        const ratio = new BigNumber(amount1.toString())
            .times(price1)
            .div(new BigNumber(amount0.toString()).times(price0))
            .shiftedBy(pool.token0.decimals - pool.token1.decimals)

        const amount0Usd = depositAmountUsd.div(ratio.plus(1))
        const amount1Usd = ratio.times(amount0Usd)

        return {
            amount0: BigInt(amount0Usd.div(price0).shiftedBy(pool.token0.decimals).toFixed(0)),
            amount1: BigInt(amount1Usd.div(price1).shiftedBy(pool.token1.decimals).toFixed(0)),
        }
    }

    /**
     * Calculates the token amounts for a given liquidity position.
     *
     * @param {Pool} pool - The pool where the position was created.
     * @param {bigint} liquidity - The amount of liquidity provided in the pool.
     * @param {bigint} tickLower - The lower tick of the position.
     * @param {bigint} tickUpper - The upper tick of the position.
     *
     * @returns An object containing `amount0` and `amount1`.
     */
    public static getPositionTokenAmounts(
        pool: Pool,
        liquidity: bigint,
        tickLower: bigint,
        tickUpper: bigint,
    ) {
        const { amount0, amount1 } = new Position({
            pool,
            liquidity: liquidity.toString(),
            tickLower: Number(tickLower),
            tickUpper: Number(tickUpper),
        })

        return {
            amount0: BigInt(amount0.quotient.toString()),
            amount1: BigInt(amount1.quotient.toString()),
        }
    }

    /**
     * Returns the collectable amount of fees for a specific position.
     *
     * @param {bigint} tokenId - The ID of the position.
     * @param {NonFungiblePositionManager} positionManager - The position manager contract.
     * @param {AddressLike} from - The address from which the position was created.
     *
     * @returns Fee amounts.
     */
    public static getPositionFees(
        tokenId: bigint,
        positionManager: NonFungiblePositionManager,
        from: AddressLike,
    ) {
        return positionManager.collect.staticCall({
            tokenId,
            recipient: ZeroAddress,
            amount0Max: MAX_UINT_128,
            amount1Max: MAX_UINT_128,
        }, { from })
    }

    /**
     * Converts a tick to a human-readable price.
     *
     * @param {bigint} tick - The tick for which to return the price.
     * @param {ERC20Json} tokenA - The base token.
     * @param {ERC20Json} tokenB - The quote token.
     *
     * @returns A BigNumber representing the price.
     */
    public static tickToPrice(
        tick: bigint,
        tokenA: ERC20Json,
        tokenB: ERC20Json,
    ): BigNumber {
        return new BigNumber(
            tickToPrice(
                new Token(tokenA.chainId, tokenA.address, tokenA.decimals),
                new Token(tokenB.chainId, tokenB.address, tokenB.decimals),
                Number(tick),
            ).toFixed(8),
        )
    }

    /**
     * Calculates a price ratio based on a percentage from the current price.
     *
     * @param {BigNumber} percentage - The relative percentage expressed as a decimal.
     * @param {Price<Token, Token>} currentPrice - The current price of the pool.
     *
     * @returns A new `Price` object.
     */
    public static percentageToPriceRatio(
        percentage: BigNumber,
        currentPrice: Price<Token, Token>,
    ) {
        // If percentage is lower than -1 (a.k.a -100%) return price as zero
        if (percentage.lte(-1)) {
            return new Price(
                currentPrice.baseCurrency,
                currentPrice.quoteCurrency,
                0,
                0,
            )
        }

        const percentageAsFraction = new Fraction(
            percentage.shiftedBy(UniswapV3.PRICE_PERCENTAGE_DECIMALS).toFixed(0),
            10 ** UniswapV3.PRICE_PERCENTAGE_DECIMALS,
        )

        const rawPrice = currentPrice.add(
            currentPrice.asFraction.multiply(percentageAsFraction),
        )

        return new Price(
            currentPrice.baseCurrency,
            currentPrice.quoteCurrency,
            rawPrice.denominator,
            rawPrice.numerator,
        )
    }

    public static getPriceRatio(price: string, baseToken: Token, quoteToken: Token) {
        const [
            whole,
            fraction,
        ] = price.split('.')

        const decimals = fraction?.length ?? 0
        const withoutDecimals = JSBI.BigInt((whole ?? '') + (fraction ?? ''))

        return new Price(
            baseToken,
            quoteToken,
            JSBI.multiply(JSBI.BigInt(10 ** decimals), JSBI.BigInt(10 ** baseToken.decimals)),
            JSBI.multiply(withoutDecimals, JSBI.BigInt(10 ** quoteToken.decimals)),
        )
    }

    public static getBurnAmounts(
        pool: Pool,
        liquidity: bigint,
        tickLower: bigint,
        tickUpper: bigint,
        slippage: BigNumber = BigNumber(0.01), // 1%
    ) {
        /**
         * `burnAmounts` method doesn't work for other exchanges since the
         * internal method uses Uniswap's Pool with their respective fees to calculate the amounts.
         */
        const position = new Position({
            pool,
            liquidity: liquidity.toString(),
            tickLower: Number(tickLower),
            tickUpper: Number(tickUpper),
        })

        const amount0 = BigInt(position.amount0.quotient.toString())
        const amount1 = BigInt(position.amount1.quotient.toString())

        return {
            minOutputToken0: Slippage.deductSlippage(amount0, slippage),
            minOutputToken1: Slippage.deductSlippage(amount1, slippage),
        }
    }

    public static getTickFromPrice(
        price: Price<Token, Token>,
        feeAmount: ExchangeFeeAmount,
    ): number {
        let tick: number

        // check price is within min/max bounds, if outside return min/max
        const sqrtRatioX96 = encodeSqrtRatioX96(price.numerator, price.denominator)

        if (JSBI.greaterThanOrEqual(sqrtRatioX96, TickMath.MAX_SQRT_RATIO))
            tick = TickMath.MAX_TICK

        else if (JSBI.lessThanOrEqual(sqrtRatioX96, TickMath.MIN_SQRT_RATIO))
            tick = TickMath.MIN_TICK

        else
            // this function is agnostic to the base, will always return the correct tick
            tick = priceToClosestTick(price)

        return nearestUsableTick(tick, TICK_SPACINGS[feeAmount])
    }

    private static getPriceRangeTicks(
        pool: Pool,
        lowerPricePercentage: BigNumber,
        upperPricePercentage: BigNumber,
    ): { tickLower: number, tickUpper: number } {
        const currentPrice = pool.token0Price

        const lowerPrice = UniswapV3.percentageToPriceRatio(lowerPricePercentage, currentPrice)
        const upperPrice = UniswapV3.percentageToPriceRatio(upperPricePercentage, currentPrice)

        return {
            tickLower: UniswapV3.getTickFromPrice(lowerPrice, pool.fee),
            tickUpper: UniswapV3.getTickFromPrice(upperPrice, pool.fee),
        }
    }
}
