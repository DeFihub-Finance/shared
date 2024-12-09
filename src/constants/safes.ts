import { ChainIds } from '@ryze-blockchain/ethereum'

const multichain = '0xac4faf64cd5353bfc6c046797e9a5be5ec88f714'

export const safes = {
    [ChainIds.ARBITRUM]: '0xcd6e9cba3851f2859304ae85b2b62fa344758c1d',
    [ChainIds.BNB]: '0x22fb56f081f869ef1b8e8a67b4f8acb4b8d2894e',
    [ChainIds.POLYGON]: multichain,
}
