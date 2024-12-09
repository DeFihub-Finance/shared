import { FeeAmount as UniswapFeeAmount } from '@uniswap/v3-sdk'

// `MEDIUM` is the only different fee amount that Pancake uses compared to Uniswap.
enum PancakeFeeAmount {
    MEDIUM = 2500,
}

export type ExchangeFeeAmount = UniswapFeeAmount | PancakeFeeAmount

// Make sure to check the tick spacings of the exchange before using it.
export const TICK_SPACINGS: Record<ExchangeFeeAmount, number> = {
    [UniswapFeeAmount.LOWEST]: 1,
    [UniswapFeeAmount.LOW]: 10,
    [PancakeFeeAmount.MEDIUM]: 50,
    [UniswapFeeAmount.MEDIUM]: 60,
    [UniswapFeeAmount.HIGH]: 200,
}
