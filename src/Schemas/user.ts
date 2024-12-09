import {
    object as zodObject,
    number as zodNumber,
} from 'zod'
import type { TypedDataField } from 'ethers'

export class UserSchema {
    public static readonly types: Record<string, TypedDataField[]> = {
        Body: [
            { name: 'action', type: 'string' },
            { name: 'nonce', type: 'uint256' },
        ],
    }

    public static readonly schema = zodObject({
        nonce: zodNumber().int().nonnegative(),
    })
}
