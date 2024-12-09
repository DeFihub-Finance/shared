import type { TypedDataDomain } from 'ethers'

export class DeFihubSchema {
    public static readonly domain: TypedDataDomain = {
        name: 'defihub.fi',
        version: '1',
    }
}
