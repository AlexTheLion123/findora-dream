
import type { UniswapV2Factory } from '$lib/typesUsed/UniswapV2Factory';
import type { JsonRpcSigner } from '@ethersproject/providers';
import { getExactSwapData } from './ExchangeUtils';
import { getOtherNumTokens, getDollarValue, getRoute } from '$lib/scripts/Exchange/ExchangeQueries';


/**
 * 
 * @param numTk1 number of tokens 1 to swap
 * @param numTk2 number of tokens 2 to swap
 * @param addr1 address of the 1st token
 * @param addr2 address of the second token
 * @param isCurrent whether the token box is the one that refers to the token we want to swap
 * @param factory factory contract instance
 * @param nativeAddr address of the native token on the blockchain
 * @param _signer signer instance
 * @returns 
 */

export async function handleSelectionGeneric(_numTk1: number | undefined, _numTk2: number | undefined, _addr1: string, _addr2: string | undefined, isCurrent: boolean, _factory: UniswapV2Factory, nativeAddr: string, _signer: JsonRpcSigner) {
    let _dollars1: number | undefined
    let _dollars2: number | undefined

    if (_numTk1) {
        // current box fully filled out
        // need to work out dollars again since different token
        _dollars1 = await getDollarValue(_addr1, _numTk1); // TODO remove await, can handle async

        if (_addr2 && isCurrent) {
            // other token selected as well
            return assignVars(await getExactSwapData(_addr1, _addr2, _numTk1, _factory, nativeAddr, _signer), false)

        } else if (_addr2 && !isCurrent) {
            if(!_numTk2) throw "this should never happen"
            return assignVars(await getExactSwapData(_addr2, _addr1, _numTk2, _factory, nativeAddr, _signer), true)
        }
    } else if (_addr2 && _numTk2) {
        return assignVars(await getExactSwapData(_addr2, _addr1, _numTk2, _factory, nativeAddr, _signer), true)
    }

    return assignVars({route: null, numOutput: 0, dollarsOutput: 0}, false);

    function assignVars({ route, numOutput, dollarsOutput }: { route: string[] | null, numOutput: number, dollarsOutput: number }, swapVals: boolean) {
        if (!swapVals) {
            return {
                dollars1: _dollars1,
                dollars2: dollarsOutput,
                route: route,
                numTk1: numOutput,
                numTk2:_numTk2
            }

        } else {
            return {
                dollars1: dollarsOutput,
                dollars2: _dollars2,
                route: route,
                numTk1: _numTk1,
                numTk2:numOutput
            }
        }
    }
}

export async function handleInputGeneric(numTk1: number, addr1: string | undefined, addr2: string | undefined, factory: UniswapV2Factory, nativeAddr: string, _signer: JsonRpcSigner) {
    let route = null
    let dollars1
    let dollarsOutput
    let numOutput

    if (addr1) {
        // token 1 selected
        dollars1 = await getDollarValue(addr1, numTk1);

        if (addr2) {
            // token 2 also selected, then we can go ahead and get all data
            const {route: routeR, numOutput, dollarsOutput} = await getExactSwapData(addr1, addr2, numTk1, factory, nativeAddr, _signer)
            route = routeR
        }
    }

    // we don't care if only token2 is selected since this is handled by token2 selection event
    // And of course, we also don't care if neither are selected.

    return {
        dollars1: dollars1,
        dollars2: dollarsOutput,
        route: route,
        numTk1: numTk1,
        numTk2: numOutput
    }
}


