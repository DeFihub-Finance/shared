import { BigNumber } from '@ryze-blockchain/ethereum'
import type { ChainId } from '@ryze-blockchain/ethereum'

export interface HubVault {
    chainId: ChainId
    vaultAddress: string
    stakedTokenAddress: string
    multiAsset: boolean
    apr: BigNumber
}

export interface HubVaultJSON extends Omit<HubVault, 'apr'> {
    apr: string
}
