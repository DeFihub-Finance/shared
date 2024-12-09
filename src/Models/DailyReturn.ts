import { BigNumber } from '@ryze-blockchain/ethereum'
import dayjs, { Dayjs } from 'dayjs'

export interface DailyReturnJson {
    rate: string
    timestamp: string
}

export class DailyReturn {
    public constructor(
        public readonly rate: BigNumber,
        public readonly timestamp: Dayjs,
    ) {
    }

    public toJSON(ratePrecision = 4): DailyReturnJson {
        return {
            rate: new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: ratePrecision,
            }).format(this.rate.toNumber()),
            timestamp: this.timestamp.toISOString(),
        }
    }

    public static fromJSON(json: DailyReturnJson): DailyReturn {
        return new DailyReturn(
            new BigNumber(json.rate),
            dayjs(json.timestamp),
        )
    }

    /**
     * Calculate daily returns for a given APY
     *
     * @param apy - 1% = 0.01
     * @param days - how many data-points to calculate
     */
    public static calculateDailyReturns(apy: number, days: number): DailyReturn[] {
        const apyBigNumber = new BigNumber(apy)
        const dailyRate = new BigNumber(Math.pow(apyBigNumber.plus(1).toNumber(), 1 / 365) - 1)
        const dailyReturnsArray: DailyReturn[] = []

        for (let i = 0; i < days; i++) {
            dailyReturnsArray.push(
                new DailyReturn(
                    i === 0
                        ? new BigNumber(0)
                        : dailyRate.plus(1).pow(i).minus(1).times(100),
                    dayjs().subtract(days - i - 1, 'days'),
                ),
            )
        }

        return dailyReturnsArray
    }
}
