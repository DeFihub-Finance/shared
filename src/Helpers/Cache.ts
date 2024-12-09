import dayjs, { type Dayjs } from 'dayjs'

export class Cache<KeyType extends string | number | symbol, ValueType> {
    private readonly _cache = new Map<KeyType, { expireAt: Dayjs | undefined, value: ValueType }>()

    public constructor(public readonly ttl?: number) {}

    public get(key: KeyType): ValueType | undefined {
        const value = this._cache.get(key)

        if (value && value.expireAt && value.expireAt.isBefore(dayjs())) {
            this._cache.delete(key)

            return undefined
        }

        return value?.value
    }

    public set(key: KeyType, value: ValueType) {
        this._cache.set(key, {
            expireAt: this.ttl
                ? dayjs().add(this.ttl, 'millisecond')
                : undefined,
            value,
        })
    }

    public delete(key: KeyType) {
        this._cache.delete(key)
    }
}
