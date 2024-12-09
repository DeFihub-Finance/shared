import { sleep } from '@ryze-blockchain/ethereum'

interface RetryPromiseParams<CallbackReturnType, OnMaxAttemptsReturnType> {
    /** A function that returns a promise to resolve. */
    callback: () => Promise<CallbackReturnType>

    /** A function that is executed when the maximum amount of attempts is reached. */
    onMaxAttempts?: (error?: unknown) => OnMaxAttemptsReturnType

    /**
     * The maximum amount of attempts.
     *
     * `default: 5`
     */
    maxAttempts?: number,

    /**
     * A starting interval (in ms) to delay the execution after the first attempt fails.
     * In order to increase the success rate, it uses an incremental backoff strategy to increase the delay.
     *
     * `default: 250`
     */
    baseInterval?: number,
}

/** Retries a given promise until it succeeds or reaches a maximum number of attempts. */
export const retryPromise = async <CallbackReturnType, OnMaxAttemptsReturnType>({
    callback,
    onMaxAttempts,
    maxAttempts = 5,
    baseInterval = 250,
}: RetryPromiseParams<CallbackReturnType, OnMaxAttemptsReturnType>): Promise<CallbackReturnType | OnMaxAttemptsReturnType> => {
    let currentInterval = baseInterval
    let lastError: unknown

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            return await callback()
        }
        catch (error) {
            lastError = error

            if (attempt === maxAttempts) break

            await sleep(currentInterval)

            currentInterval += baseInterval
        }
    }

    if (onMaxAttempts)
        return onMaxAttempts(lastError)

    throw lastError
}
