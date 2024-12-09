export function createArrayOfIndexes(length: bigint): bigint[] {
    return Array.from({ length: Number(length) }, (_, i) => BigInt(i))
}
