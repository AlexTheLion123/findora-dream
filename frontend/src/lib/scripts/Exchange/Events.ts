
import { getOtherNumTokens, getDollarValue, getRoute } from '$lib/scripts/Exchange/Swap';
import { isProvided } from '$lib/stores';
import type { Address } from 'soltypes';


/**
 * 
 * @returns an object representing the correct state of the global variables for the UI. some may be undefined
 */
export async function handleSelectionGeneric(numTk1P: number | undefined, numTk2P: number | undefined, addr1P: Address, addr2P: Address | undefined, isCurrent: boolean) {
    let routeP: Address[] | undefined
    let dollars1P: number | undefined
    let dollars2P: number | undefined

    if (numTk1P) {
        // current box fully filled out
        // need to work out dollars again since different token
        dollars1P = await getDollarValue(addr1P, numTk1P); // TODO remove await, can handle async

        if (addr2P && isCurrent) {
            // other token selected as well
            assignVars(await getExactSwapData(addr1P, addr2P, numTk1P), false)

        } else if (addr2P && !isCurrent) {
            assignVars(await getExactSwapData(addr2P, addr1P, numTk2P), true)
        }
    } else if (addr2P && numTk2P) {
        assignVars(await getExactSwapData(addr2P, addr1P, numTk2P), true)
    }

    return {
        dollars1R: dollars1P,
        dollars2R: dollars2P,
        routeR: routeP,
        numTk1R: numTk1P,
        numTk2R: numTk2P
    }

    function assignVars({route, numTk1 , dollars1}: {route: Address[], numTk1:number, dollars1: number}, swapVals) {
        console.log(route, numTk1, dollars1)
        routeP = route;
        if(!swapVals) {
            numTk2P = numTk1;
            dollars2P = dollars1;
        } else {
            numTk1P = numTk1;
            dollars1P = dollars1;
        }
    }

}

async function getExactSwapData(addr1: Address, addr2: Address, numTk1: number) {
    const route = await getRoute(addr1, addr2);
    const numTk2 = await getOtherNumTokens(addr1, addr2, numTk1, route);
    const dollars2 = await getDollarValue(addr2, numTk2)
    return {
        route: route,
        numTk1: numTk2,
        dollars1: dollars2
    }
}


export async function handleInputGeneric(numTk1P: number, addr1P: Address | undefined, addr2P: Address | undefined) {
    let routeP
    let dollars1P
    let numTk2P
    let dollars2P

    if (addr1P) {
        // token 1 selected
        dollars1P = await getDollarValue(addr1P, numTk1P);

        if (addr2P) {
            // token 2 also selected, then we can go ahead and get all data
            routeP = await getRoute(addr1P, addr2P);
            numTk2P = await getOtherNumTokens(addr1P, addr2P, numTk1P, routeP);
            dollars2P = await getDollarValue(addr2P, numTk2P);
        }
    }

    // we don't care if only token2 is selected this is handled by token2 selection event
    // And of course, we also don't care if neither are selected.

    return {
        dollars1R: dollars1P,
        dollars2R: dollars2P,
        routeR: routeP,
        numTk1R: numTk1P,
        numTk2R: numTk2P
    }
}


