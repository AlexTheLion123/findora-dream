import {ethers} from 'ethers'
import {getRoute, getOtherNumTokens, getPairAddress, checkAllowance, NoRouteError, SamePairError, getDollarValue, removeDecimals} from '.'
import type { UniswapV2Router02, UniswapV2Factory } from '$lib/typesUsed'
import type {Signer} from 'ethers'
import type { ITokenInfo, IStores } from '$lib/typesFrontend'

export async function performSwap(amountInExact: number, amountOutMin: number, route: string[], to: string, router: UniswapV2Router02, signer: Signer, deadline: number) {
    const amountInBigN = ethers.utils.parseEther(amountInExact.toString())
    const amountOutBigN = ethers.utils.parseEther(amountOutMin.toString())

    let txn = await router.swapExactTokensForTokens(amountInBigN, amountOutBigN, route, to, amountInBigN) // TODO fix deadline to sensible number
    await txn.wait();

    alert("yay, swap performed")

}

// TODO clean unnessarily large number of arguments
export async function getExactSwapData({addrInput, addrOutput, numInput, decimals}: ITokenInfo, {nativeAddr, signerAddr, signer, factory, router}: IStores) {
    let route: string[];
    let numOutput: ethers.BigNumber[] | undefined;
    let dollarOutput: number;
    let pairAddress: string;
    let sufficientAllowance: boolean;

    try {
        route = await getRoute(addrInput, addrOutput, factory, nativeAddr)
        numOutput = await getOtherNumTokens(numInput, route, router)
        if (!numOutput) throw "numOutput does not exist";
        dollarOutput = await getDollarValue(addrOutput, removeDecimals(numOutput[0], decimals))
        pairAddress = getPairAddress(factory.address, addrInput, addrOutput);

        sufficientAllowance = await checkAllowance(numInput, signerAddr, router.address, pairAddress, signer);

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
        numOutput: parseInt(ethers.utils.formatEther(numOutput[1])),
        dollarOutput: dollarOutput,
        pairAddress: pairAddress,
        sufficientAllowance: sufficientAllowance
    }
}



export async function performLiquidity() {
    alert("perform liquidity")
}