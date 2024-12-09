import { notEmpty } from '@ryze-blockchain/ethereum'
import type { ErrorDescription, Interface } from 'ethers'
import { ICall__factory } from '../Types'

interface LowLevelCallError {
    args: {
        to: string
        inputData: string
        revertData: string
    }
}

/**
 * Decodes a stack of low-level call errors and throws a human-readable error message
 *
 * @param error - The error to decode.
 * @param contractInterfaces - The interfaces of the contracts that may have thrown the error.
 */
export function decodeLowLevelCallError(
    error: unknown,
    contractInterfaces: Interface[],
): ErrorDescription | string | undefined {
    const callInterface = ICall__factory.createInterface()
    const typedError = error as { data?: string | null }

    if (typedError.data) {
        let parsedError: ErrorDescription | null = null
        let nextData = typedError.data

        while (nextData && nextData !== '0x') {
            parsedError = callInterface.parseError(nextData)

            // if error cannot be parsed by the ICall interface, it isn't an instance of LowLevelCallError, therefore we try parsing it with other contract interfaces
            if (!parsedError) {
                const customError = contractInterfaces
                    .map(contractInterface => contractInterface.parseError(nextData))
                    .filter(notEmpty)[0]

                if (customError)
                    return customError
            }

            nextData = (parsedError as unknown as LowLevelCallError).args.revertData
        }

        // Parse error message if it's a string
        if (parsedError?.signature === 'Error(string)')
            return parsedError.args[0]

        // Parse solidity panic codes
        if (parsedError?.signature === 'Panic(uint256)')
            return `Solidity panic with error code ${ parsedError.args[0] }`
    }
}
