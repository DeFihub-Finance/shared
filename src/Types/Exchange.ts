import type { ZapProtocol } from '~/src/Types'

export interface HubExchange {
    factory: string
    positionManager: string
    router: string
    quoter: string
    name: string
    image: string
    feeTiers: number[]
    protocol: ZapProtocol
}
