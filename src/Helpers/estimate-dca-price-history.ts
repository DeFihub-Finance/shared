import { mergePriceSnapshots, PriceSnapshot } from './PriceSnapshot'
import { BigNumber } from '@ryze-blockchain/ethereum'
import dayjs from 'dayjs'

export function estimateDcaPriceHistory(
    inputTokenPriceHistory: PriceSnapshot[],
    outputTokenPriceHistory: PriceSnapshot[],
) {
    if (!inputTokenPriceHistory?.length || !outputTokenPriceHistory?.length)
        return []

    const priceHistoryByTimestamp = mergePriceSnapshots(
        inputTokenPriceHistory,
        outputTokenPriceHistory,
        'YYYY-MM-DDT00:00:00Z',
    )

    const priceHistoryValues = Object.values(priceHistoryByTimestamp)
    const averagePriceHistory: PriceSnapshot[] = []

    let accumulatedInputTokenPrice = new BigNumber(0)
    let accumulatedOutputTokenPrice = new BigNumber(0)
    let averagePrice = new BigNumber(0)

    for (const { inputTokenSnapshot, outputTokenSnapshot } of priceHistoryValues) {
        accumulatedInputTokenPrice = accumulatedInputTokenPrice.plus(inputTokenSnapshot.price)
        accumulatedOutputTokenPrice = accumulatedOutputTokenPrice.plus(outputTokenSnapshot.price)
        averagePrice = accumulatedOutputTokenPrice.div(accumulatedInputTokenPrice)

        averagePriceHistory.push({
            price: averagePrice,
            timestamp: outputTokenSnapshot.timestamp.startOf('day'),
        })
    }

    // pushes the current average price with the current timestamp
    averagePriceHistory.push({
        price: averagePrice,
        timestamp: dayjs(),
    })

    return averagePriceHistory
}
