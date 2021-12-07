import { ethers } from 'ethers'
import { ERC20ABI } from '$lib/abis/ERC20ABI';
import { UniswapV2PairABI } from '$lib/abis/UniswapV2PairABI';
import type { MyToken } from '$lib/typesUsed/MyToken'
import type { JsonRpcSigner } from '@ethersproject/providers';
import { getErc20Balance, checkAddressAgainstNative, checkAddressExists, addDecimals } from './ExchangeUtils';
import type { UniswapV2Factory } from '$lib/typesUsed/UniswapV2Factory';
import type { UniswapV2Pair } from '$lib/typesUsed/UniswapV2Pair';
import { calcOutputFromPair } from './ExchangeUtils';
import type { UniswapV2Router02 } from '$lib/typesUsed/UniswapV2Router02';
import { NoRouteError, SamePairError } from './Errors';


export async function getBalance(contract_address: string, _signer: JsonRpcSigner) {
    // test below
    // const cont = await new ethers.Contract('0xCfEB869F69431e42cdB54A4F4f105C19C080A601', ERC20ABI, _signer) as MyToken;
    // test above
    console.log(contract_address)
    const erc20Contract = await new ethers.Contract(contract_address, ERC20ABI, _signer) as MyToken

    const bal = await getErc20Balance(erc20Contract, await _signer.getAddress());
    return bal;
}

/**
 * @dev must be calculated by front-end or smart contract user. No helper functions in contract
 * For now, just check both tokens against the native. 
 * Add additional checks against other popular tokens as they get added
 * @param nativeAddr - address of the native token of that blockchain
 * @param finalDest - address of the account to send the final output tokens to
 */
export async function getRoute(addr1: string, addr2: string, factory: UniswapV2Factory, nativeAddr: string): Promise<string[]> {
    if (addr1 === addr2) {
        throw new SamePairError();
    }

    const pairAddress = await factory.getPair(addr1, addr2);
    if (checkAddressExists(pairAddress)) {
        return [addr1, addr2]
    }

    // check indirect pair against native, throws if no pair
    if (await checkAddressAgainstNative(factory, nativeAddr, addr1) && await checkAddressAgainstNative(factory, nativeAddr, addr2)) {
        return [addr1, nativeAddr, addr2];
    }

    // if this point is reached, no route exists and returns empty array
    throw new NoRouteError();
}

export async function getOtherNumTokens(
    factory_addr: string,
    numInput: number,
    route: string[],
    _signer: JsonRpcSigner
) {
    if (!route || route.length < 2) {
        throw new NoRouteError();
    }

    if (route.length === 2) {
        return calcOutputFromPair(factory_addr, numInput, route[0], route[1], _signer)
    }

    // last item is destination, not pair
    let currentNum = numInput;
    for (let i = 0; i < (route.length - 1); i++) {
        currentNum = await calcOutputFromPair(factory_addr, currentNum, route[i], route[i + 1], _signer)
    }
    return currentNum;
}


export async function getDollarValue(addr: string, numTk: number) { // TODO fix last probably
    return numTk * Math.random() * 100;
}

/**
 * 
 * @param amountInExact Exact amount of token1 to be inputted
 * @param amountOutMin Minimum amount of token2 to receive
 * @param deadline number in secods e.g. 60 -> 60 seconds after txn submission
 */
export async function performSwap(amountInExact: number, amountOutMin: number, route: string[], to: string, router: UniswapV2Router02, _signer: JsonRpcSigner, deadline: number) {
    const amountIn = addDecimals(amountInExact)
    const amountOut = addDecimals(amountOutMin)
    let txn = await router.swapExactTokensForTokens(amountIn, amountOut, route, to, amountIn) // TODO fix deadline to sensible number
    await txn.wait()
}

export async function performLiquidity() {
    alert("perform liquidity")
}
