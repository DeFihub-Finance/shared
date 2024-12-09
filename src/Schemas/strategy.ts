import {
    object as zodObject,
    string as zodString,
    array as zodArray,
    bigint as zodBigInt,
    boolean as zodBoolean,
    NEVER as zodNever,
} from 'zod'
import { containsProfaneWords } from '~/src/Helpers'

/*
    The `superRefine` method is used to create a Zod schema with a custom
    property `shortMessage` when the validation fails. The purpose of this
    short message is to be used as a helper text for an input validation,
    alongside a default `message` property that can be displayed in the
    toast notification for a better context instead of using a short one.
*/

export const percentageSchema = zodString({
    invalid_type_error: 'Invalid number',
    required_error: 'Required field',
})
    .transform(Number)
    .superRefine((value, ctx) => {
        if (!Number.isInteger(value)) {
            ctx.addIssue({
                code: 'custom',
                message: 'Percentage value must be an integer',
                params: { shortMessage: 'Must be an integer' },
                fatal: true,
            })

            return zodNever
        }

        if (value < 1 || value > 100) {
            ctx.addIssue({
                code: 'custom',
                message: 'Percentage must be within 1 and 100',
                params: { shortMessage: 'Must be within 1 and 100' },
            })
        }
    })

export const dcaDurationSchema = zodString({
    invalid_type_error: 'Invalid number',
    required_error: 'Required field',
})
    .transform(Number)
    .superRefine((value, ctx) => {
        if (!Number.isInteger(value)) {
            ctx.addIssue({
                code: 'custom',
                message: 'DCA duration value must be an integer',
                params: { shortMessage: 'Must be an integer' },
                fatal: true,
            })

            return zodNever
        }

        if (value < 1) {
            ctx.addIssue({
                code: 'custom',
                message: 'DCA duration must be greater than 1',
                params: { shortMessage: 'Must be 1 or more' },
                fatal: true,
            })

            return zodNever
        }

        if (value > 65536) {
            ctx.addIssue({
                code: 'custom',
                message: 'DCA duration must be less than 65,536',
                params: { shortMessage: 'Must be less than 65,536' },
            })
        }
    })

export const createStrategySchema = zodObject({
    name: zodString()
        .trim()
        .min(3, { message: 'Name must be 3 or more characters long.' })
        .max(64, { message: 'Name exceeds maximum amount of 64 characters long.' })
        .refine(name => !containsProfaneWords(name), { message: 'Name contains contains profane words' }),
    bio: zodString()
        .trim()
        .min(10, { message: 'Bio must contain at least 10 characters.' })
        .max(1024, { message: 'Bio exceeds maximum amount of 1024 characters long.' })
        .refine(bio => !containsProfaneWords(bio), { message: 'Bio contains contains profane words' }),
    dcaInvestments: zodArray(
        zodObject({
            poolId: zodBigInt(),
            swaps: dcaDurationSchema,
            percentage: percentageSchema,
        }),
    ),
    vaultInvestments: zodArray(
        zodObject({
            vault: zodString(),
            percentage: percentageSchema,
        }),
    ),
    buyInvestments: zodArray(
        zodObject({
            token: zodString(),
            percentage: percentageSchema,
        }),
    ),
    liquidityInvestments: zodArray(
        zodObject(
            {
                positionManager: zodString(),
                token0: zodString(),
                token1: zodString(),
                fee: zodBigInt(),
                usePercentageBounds: zodBoolean(),
                lowerBound: zodString(),
                upperBound: zodString(),
                percentage: percentageSchema,
            },
            {
                invalid_type_error: 'Pool data does not match expected value.',
                required_error: 'Pool not found! Make sure you select a valid pool.',
            },
        ),
    ),
})
