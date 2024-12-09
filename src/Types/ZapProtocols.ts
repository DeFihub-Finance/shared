export const ZapProtocols = {
    UniswapV2: 'UniswapV2',
    UniswapV3: 'UniswapV3',
    PancakeV3: 'PancakeV3',
} as const

export type ZapProtocol = typeof ZapProtocols[keyof typeof ZapProtocols]
