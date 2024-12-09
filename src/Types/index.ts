export * from './Contracts'
export * from './Dca'
export * from './Exchange'
export * from './LiquidityPool'
export * from './Strategy'
export * from './Tokens'
export * from './Vaults'
export * from './PaginatedResponse'
export * from './ZapProtocols'
export * from './WebSocket'

export type PartialRecord<KeyType extends string | number | symbol, ValueType> = Partial<Record<KeyType, ValueType>>
