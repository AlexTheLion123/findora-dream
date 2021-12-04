
import type { Address } from 'soltypes';

// Exchange


export interface ICallbackReturn {
    dollars1R: number | undefined,
    dollars2R: number | undefined,
    routeR: Address[] | undefined,
    numTk1R: number | undefined,
    numTk2R: number | undefined
}

export type TCallback = (numTokens1: number | undefined, addr1: Address, addr2: Address, bool: boolean) => Promise<ICallbackReturn>