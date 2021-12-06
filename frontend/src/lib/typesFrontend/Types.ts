
// Exchange
export interface ICallbackReturn {
    dollars1: number | undefined,
    dollars2: number | undefined,
    route: String[] | undefined,
    numTk1: number | undefined,
    numTk2: number | undefined
}

export type TCallback = (numTokens1: number | undefined, addr1: String, addr2: String, bool: boolean) => Promise<ICallbackReturn>