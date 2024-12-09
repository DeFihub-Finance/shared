import BadWordsFilter from 'bad-words'
import { keccak256 } from 'ethers'

const profanityFilter = new BadWordsFilter()

export function containsProfaneWords(str: string) {
    return profanityFilter.isProfane(str)
}

export function toKeccak256(strs: string[]) {
    return keccak256(new TextEncoder().encode(strs.join('')))
}
