
import { getOtherNumTokens, getDollarValue, getRoute } from '$lib/scripts/Exchange/ExchangeQueries';
import type { UniswapV2Factory } from '$lib/typesUsed/UniswapV2Factory';

export async function handleSelectionGeneric(numTk1: number | undefined, numTk2: number | undefined, addr1: string, addr2: string | undefined, isCurrent: boolean, factory: UniswapV2Factory, nativeAddr: string) {
    let route: string[] | undefined
    let dollars1: number | undefined
    let dollars2: number | undefined

    if (numTk1) {
        // current box fully filled out
        // need to work out dollars again since different token
        dollars1 = await getDollarValue(addr1, numTk1); // TODO remove await, can handle async

        if (addr2 && isCurrent) {
            // other token selected as well
            assignVars(await getExactSwapData(addr1, addr2, numTk1, factory, nativeAddr), false)

        } else if (addr2 && !isCurrent) {
            assignVars(await getExactSwapData(addr2, addr1, numTk2, factory, nativeAddr), true)
        }
    } else if (addr2 && numTk2) {
        assignVars(await getExactSwapData(addr2, addr1, numTk2, factory, nativeAddr), true)
    }

    return {
        dollars1: dollars1,
        dollars2: dollars2,
        route: route,
        numTk1: numTk1,
        numTk2: numTk2
    }

    function assignVars({ route: routeR, numTk1: numTk1R, dollars1: dollars1R }: { route: string[], numTk1: number, dollars1: number }, swapVals) {
        route = routeR;
        if (!swapVals) {
            numTk2 = numTk1R;
            dollars2 = dollars1R;
        } else {
            numTk1 = numTk1R;
            dollars1 = dollars1R;
        }
    }

}

async function getExactSwapData(addr1: string, addr2: string, numTk1: number, factory: UniswapV2Factory, nativeAddr: string) {

    const route = await getRoute(addr1, addr2, factory, nativeAddr)
    if (!route) return;

    const numTk2 = await getOtherNumTokens(addr1, addr2, numTk1, route);
    const dollars2 = await getDollarValue(addr2, numTk2)
    return {
        route: route,
        numTk1: numTk2,
        dollars1: dollars2
    }
}

export async function handleInputGeneric(numTk1: number, addr1: string | undefined, addr2: string | undefined, factory: UniswapV2Factory, nativeAddr: string) {
    let route
    let dollars1
    let numTk2
    let dollars2

    if (addr1) {
        // token 1 selected
        dollars1 = await getDollarValue(addr1, numTk1);

        if (addr2) {
            // token 2 also selected, then we can go ahead and get all data

            route = await getRoute(addr1, addr2, factory, nativeAddr); 
            numTk2 = await getOtherNumTokens(addr1, addr2, numTk1, route);
            dollars2 = await getDollarValue(addr2, numTk2);
        }
    }

    // we don't care if only token2 is selected this is handled by token2 selection event
    // And of course, we also don't care if neither are selected.

    return {
        dollars1: dollars1,
        dollars2: dollars2,
        route: route,
        numTk1: numTk1,
        numTk2: numTk2
    }
}


