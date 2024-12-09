import { parseEther, parseUnits } from 'ethers'
import { BigNumber, ChainIds } from '@ryze-blockchain/ethereum'
import { encodeSqrtRatioX96, FeeAmount, nearestUsableTick, TickMath } from '@uniswap/v3-sdk'

import { Pool } from '../Models'
import { UniswapV3 } from '../Helpers'
import { ERC20Priced } from '../Types'
import { TICK_SPACINGS } from '../constants'

describe('UniswapV3 Helper', () => {
    const TEN_PERCENT = new BigNumber(0.1)
    const ETH_PRICE = BigInt(10_000)
    const ONE_BILLION_ETH = parseEther('1000000000')
    const ONE_BILLION_USDC = parseUnits('1000000000', 6)

    // Token0
    const USDC: ERC20Priced = {
        chainId: ChainIds.ETH,
        address:  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        decimals: 6,
        image: '',
        name: 'USD Coin',
        symbol: 'USDC',
        price: new BigNumber(1),
    }
    // Token1
    const WETH: ERC20Priced = {
        chainId: ChainIds.ETH,
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        decimals: 18,
        image: '',
        name: 'Wrapped Ether',
        symbol: 'WETH',
        price: new BigNumber(ETH_PRICE.toString()),
    }

    const SQRT_RATIO_X96 = encodeSqrtRatioX96(
        (ONE_BILLION_ETH / ETH_PRICE).toString(),
        ONE_BILLION_USDC.toString(),
    )

    const TICK_SPACING = TICK_SPACINGS[FeeAmount.MEDIUM]
    const POOL_TICK_CURRENT = TickMath.getTickAtSqrtRatio(SQRT_RATIO_X96)

    const pool = new Pool(
        USDC,
        WETH,
        new BigNumber(FeeAmount.MEDIUM).shiftedBy(-UniswapV3.FEE_DECIMALS),
        BigInt(SQRT_RATIO_X96.toString()),
        BigInt(0),
        BigInt(POOL_TICK_CURRENT),
    )

    const stableDepositAmount = parseUnits('100', 6)
    const stableDepositAmountBN = new BigNumber(stableDepositAmount.toString())

    describe('#percentageToPriceRatio', () => {
        describe('In terms of token0', () => {
            it('should convert to the expected upper price ratio', () => {
                const priceRatio = UniswapV3.percentageToPriceRatio(
                    new BigNumber(0.1), // +10%
                    pool.token0Price,
                )

                expect(priceRatio.toSignificant()).toEqual('0.00011')
            })

            it('should convert to the expected lower price ratio', () => {
                const priceRatio = UniswapV3.percentageToPriceRatio(
                    new BigNumber(-0.1), // -10%
                    pool.token0Price,
                )

                expect(priceRatio.toSignificant()).toEqual('0.00009')
            })
        })

        describe('In terms of token1', () => {
            it('should convert to the expected upper price ratio', () => {
                const priceRatio = UniswapV3.percentageToPriceRatio(
                    new BigNumber(0.1), // +10%
                    pool.token1Price,
                )

                expect(priceRatio.toSignificant()).toEqual('11000')
            })

            it('should convert to the expected lower price ratio', () => {
                const priceRatio = UniswapV3.percentageToPriceRatio(
                    new BigNumber(-0.1), // -10%
                    pool.token1Price,
                )

                expect(priceRatio.toSignificant()).toEqual('9000')
            })
        })

        it('should return a zero price if percentage is lower than -1', () => {
            const priceRatio = UniswapV3.percentageToPriceRatio(
                new BigNumber(-1.5), // -150%
                pool.token1Price,
            )

            expect(priceRatio.toSignificant()).toEqual('0')
        })
    })

    describe('#getMintPositionInfo', () => {
        describe('When `usePercentageBounds` is true', () => {
            it('should return the expected mint position info for in-range bounds', () => {
                const { swapAmountToken0, swapAmountToken1 } = UniswapV3.getMintPositionInfo(
                    USDC,
                    stableDepositAmountBN,
                    pool,
                    USDC.price,
                    WETH.price,
                    TEN_PERCENT.negated(),
                    TEN_PERCENT,
                    true,
                )

                const totalSwapAmount = swapAmountToken0 + swapAmountToken1

                expect(swapAmountToken0).toBeGreaterThan(0n)
                expect(swapAmountToken1).toBeGreaterThan(0n)
                expect(stableDepositAmount - totalSwapAmount).toBeLessThanOrEqual(1n)
            })
        })

        describe('When `usePercentageBounds` is false', () => {
            it('should return the expected mint position info for in-range bounds', () => {
                const tickOffset = TICK_SPACING * 2
                const poolTickCurrentBN = new BigNumber(
                    nearestUsableTick(POOL_TICK_CURRENT, TICK_SPACING),
                )

                const lowerBoundTick = poolTickCurrentBN.minus(tickOffset)
                const upperBoundTick = poolTickCurrentBN.plus(tickOffset)

                const {
                    tickLower,
                    tickUpper,
                    swapAmountToken0,
                    swapAmountToken1,
                } = UniswapV3.getMintPositionInfo(
                    USDC,
                    stableDepositAmountBN,
                    pool,
                    USDC.price,
                    WETH.price,
                    lowerBoundTick,
                    upperBoundTick,
                    false,
                )

                expect(swapAmountToken0).toBeGreaterThan(0n)
                expect(swapAmountToken1).toBeGreaterThan(0n)

                expect(tickLower).toEqual(lowerBoundTick.toNumber())
                expect(tickUpper).toEqual(upperBoundTick.toNumber())

                const totalSwapAmount = swapAmountToken0 + swapAmountToken1

                expect(stableDepositAmount - totalSwapAmount).toBeLessThanOrEqual(1n)
            })
        })
    })
})
