import type { UniswapV2Factory, UniswapV2Router02 } from "../typesUsed"
import type { Signer } from 'ethers';

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
    decimalsIn: number,
    decimalsOut: number,
}

export interface IStores {
    nativeAddr: string,
    signerAddr: string,
    signer: Signer,
    factory: UniswapV2Factory,
    router: UniswapV2Router02
}

export type TySwapData = ({
    numInput: number,
    numOutput?: never,
} | {
    numInput?: never,
    numOutput: number
}) & { route: string[], sufficientAllowance: boolean };


export interface IGetAllowance {
    tokenAddr: string,
    ownerAddr: string,
    spenderAddr: string,
    signer: Signer
}


export interface ICheckAllowance extends IGetAllowance {
    toSpend: number
}

export interface ISetSwapDataOutput {
    numTokens: number,
    decimals: number,
    route: string[]
}

export interface ISetSwapDataInput extends ISetSwapDataOutput {
    sufficientAllowance: boolean
}

export interface ISwap {
    route: string[]
    to: string,
    router: UniswapV2Router02,
    signer: Signer,
    deadline: number,
    decimalsIn: number,
    decimalsOut: number
}

interface ISwapInput extends ISwap {
    amountInExact: number,
    amountOutMin: number
}

interface ISwapOutput extends ISwap {
    amountOutExact: number,
    amountInMax: number
}



export interface IExchangeContext {
    nativeToken: {
        address: string,
        decimals: 18
    },
    dollarsToken: {
        address: string,
        decimals: 18
    },
    getProvider: () => Web3Provider,
    getFactory: () => UniswapV2Factory,
    getRouter: () => UniswapV2Router02,
    signerObj: {
        getSigner: () => Signer,
        getAddress: () => string
    }

}


export interface ISwapData {
    amountIn: BigNumber;
    amountOutDesired: BigNumber;
    address1: string;
    address2: string;
    decimals1: number;
    decimals2: number;
    route: string[];
}

export interface IAddLiqData {
    amountIn1: BigNumber;
    amountIn2: BigNumber;
    address1: string;
    address2: string;
    decimals1: number;
    decimals2: number;
}