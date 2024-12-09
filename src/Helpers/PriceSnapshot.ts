import { BigNumber, ChainMap } from '@ryze-blockchain/ethereum'
import { Dayjs } from 'dayjs'

export interface PriceSnapshot {
    price: BigNumber
    timestamp: Dayjs
}

export interface PriceSnapshotJson {
    price: string
    timestamp: string
}

export type PriceSnapshotsByToken = ChainMap<Record<string, PriceSnapshot[]>>

export type PriceSnapshotsByTokenJson = ChainMap<Record<string, PriceSnapshotJson[]>>

export type PriceSnapshotsByTimestamp = Record<string, {
    inputTokenSnapshot: PriceSnapshot
    outputTokenSnapshot: PriceSnapshot
}>

/**
 * Groups the price snapshots of input and output tokens by hour
 *
 * @param inputTokenPriceSnapshots - Price snapshots of the input token
 * @param outputTokenPriceSnapshots - Price snapshots of the output token
 * @param format - The timestamp format to group the price snapshots by
 * @returns A record of price snapshots grouped by hour
 */
export function mergePriceSnapshots(
    inputTokenPriceSnapshots: PriceSnapshot[],
    outputTokenPriceSnapshots: PriceSnapshot[],
    format: string,
): PriceSnapshotsByTimestamp {
    const inputTokenPriceByTimestamp: Record<string, PriceSnapshot> = {}
    const outputTokenPriceByTimestamp: Record<string, PriceSnapshot> = {}

    for (const priceSnapshot of inputTokenPriceSnapshots) {
        const date = priceSnapshot.timestamp.format(format)

        if (!inputTokenPriceByTimestamp[date])
            inputTokenPriceByTimestamp[date] = priceSnapshot
    }

    for (const priceSnapshot of outputTokenPriceSnapshots) {
        const date = priceSnapshot.timestamp.format(format)

        if (!outputTokenPriceByTimestamp[date])
            outputTokenPriceByTimestamp[date] = priceSnapshot
    }

    const priceSnapshotsByTimestamp: PriceSnapshotsByTimestamp = {}

    for (const inputDate in inputTokenPriceByTimestamp) {
        const inputSnapshot = inputTokenPriceByTimestamp[inputDate]
        const outputSnapshot = outputTokenPriceByTimestamp[inputDate]

        if (!inputSnapshot || !outputSnapshot)
            continue

        priceSnapshotsByTimestamp[inputDate] = {
            inputTokenSnapshot: inputSnapshot,
            outputTokenSnapshot: outputSnapshot,
        }
    }

    return priceSnapshotsByTimestamp
}
