/**
 * Filters an array to contain only unique elements based on a specified key.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} array - The array to filter for unique elements.
 * @param {(obj: T) => string | number | boolean} keyCallback - A callback function that returns the key to determine uniqueness for each element.
 * @returns {T[]} A new array containing only unique elements based on the specified key.
 *
 * @example
 * ```
 * const data = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 1, name: 'Alice' }
 * ];
 *
 * const uniqueData = unique(data, item => item.id);
 * console.log(uniqueData); // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 * ```
 */
export function unique<T>(
    array: T[],
    keyCallback: (obj: T) => string | number | boolean,
): T[] {
    const uniqueSet = new Set()

    return array.filter(obj => {
        const key = keyCallback(obj)

        // Address already seen, filter out this object
        if (uniqueSet.has(key))
            return false

        // Address not seen, keep this object and mark address as seen
        uniqueSet.add(key)

        return true
    })
}
