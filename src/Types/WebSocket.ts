import { StrategyJson, StrategyPositionJson } from './Strategy'

export type ClientToServerEvents = {
    'listen:strategy-created': (data: { strategist: string }) => void
    'listen:strategy-position-created': (data: { investor: string }) => void
}

export type ServerToClientEvents = {
    'strategy-created': (data: StrategyJson) => void
    'strategy-position-created': (data: StrategyPositionJson) => void
}

export type SocketData = {
    strategist?: string
    investor?: string
}

export const SocketNamespaces = {
    STRATEGIES: '/strategies',
    STRATEGY_POSITIONS: '/strategies/positions',
} as const
