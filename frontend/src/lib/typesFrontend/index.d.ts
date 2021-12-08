import type { UniswapV2Factory, UniswapV2Router02 } from "../typesUsed"
import type { Signer} from 'ethers';

// Exchange
export interface ICallbackReturn {
    dollars1: number | undefined,
    dollars2: number | undefined,
    route: String[] | undefined,
    numTk1: number | undefined,
    numTk2: number | undefined
}

export type TCallback = (numTokens1: number | undefined, addr1: String, addr2: String, bool: boolean) => Promise<ICallbackReturn>;

export interface ITokenInfo {
    addrInput: string,
    addrOutput: string,
    numInput: number,
    decimals: number
}

export interface IStores {
    nativeAddr: string,
    signerAddr: string,
    signer: Signer, 
    factory: UniswapV2Factory,
    router: UniswapV2Router02
}