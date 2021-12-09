import { ethers } from 'ethers'
import { getRoute, _getAmountsOut, getPairAddress, checkAllowance, NoRouteError, SamePairError, getDollarValue, removeDecimals, addDecimals } from '.'
import type { ITokenInfo, IStores, ISwapInput, ISwapOutput } from '$lib/typesFrontend'


export async function swapExactInput({ amountInExact, amountOutMin,route, to, router, deadline, decimalsIn, decimalsOut }: ISwapInput) {
    const amountInBigN = addDecimals(amountInExact, decimalsIn)
    const amountOutBigN = addDecimals(amountOutMin, decimalsOut)
    
    let txn = await router.swapExactTokensForTokens(amountInBigN, amountOutBigN, route, to, deadline) 
    await txn.wait();
    alert("yay, swap performed")
}

// TODO don't implement for now
export async function swapExactOutput({amountInMax, amountOutExact, route, to, router, signer, deadline, decimalsIn, decimalsOut}: ISwapOutput) {
    const amountInBigN = addDecimals(amountInMax, decimalsIn)
    const amountOutBigN = addDecimals(amountOutExact, decimalsOut)

    let txn = await router.swapTokensForExactTokens(amountOutBigN, amountInBigN, route, to, deadline) 
    await txn.wait();
    alert("yay, swap performed")
}



// TODO change to handle native array instead of 1 native token
export async function getRouteAndNumOutput({ addrInput, addrOutput, numInput, decimalsIn, decimalsOut }: ITokenInfo, { nativeAddr, signerAddr, signer, factory, router }: IStores): Promise<{ route: string[]; numInput: (radix?: number | undefined) => string; numOutput: number; addrInput: string; addrOutput: string; decimals: number; sufficientAllowance: boolean }> {
    let route: string[];
    let numOutput: ethers.BigNumber | undefined;
    let sufficientAllowance: boolean;

    try {

        route = await getRoute(addrInput, addrOutput, factory, nativeAddr)
        numOutput = (await _getAmountsOut(numInput, route, router))[0]

    } catch (error) {
        if (error instanceof NoRouteError) {
            alert("No route exists between this pair")
        } else if (error instanceof SamePairError) {
            alert("Cannot trade same pair")
        }
        console.log("in get swap data catch")
        throw error;

    }

    return {
        route: route,
        numInput: numInput.toString,
        numOutput: parseInt(ethers.utils.formatEther(numOutput[1])),
        addrInput: addrInput,
        addrOutput: addrOutput,
        decimals: decimals,
    }
}

export async function getRouteAndNumInput() {
    // TODO implement
}

export async function performLiquidity() {
    alert("perform liquidity")
}