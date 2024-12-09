import { BigNumber } from '@ryze-blockchain/ethereum'
import { ERC20Priced } from '~/src/Types'

export class Slippage {
    public static deductSlippage(amount: bigint, slippage: BigNumber) {
        const amountBn = new BigNumber(amount.toString())

        return BigInt(
            amountBn
                .minus(amountBn.times(slippage))
                .toFixed(0),
        )
    }

    public static getMinOutput(
        amount: bigint,
        inputToken: ERC20Priced,
        outputToken: ERC20Priced,
        slippage: BigNumber,
    ) {
        const amountBn = new BigNumber(amount.toString())

        return BigInt(
            amountBn.minus(amountBn.times(slippage))
                .div(outputToken.price.div(inputToken.price))
                .shiftedBy(outputToken.decimals - inputToken.decimals)
                .toFixed(0),
        )
    }
}
