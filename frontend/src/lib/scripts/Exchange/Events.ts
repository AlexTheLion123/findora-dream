
import { getOtherNumTokens, getDollarValue, getRoute } from '$lib/scripts/Exchange/Swap';
import { isProvided } from '$lib/stores';
import type { Address } from 'soltypes';


/**
 * 
 * @returns an object representing the correct state of the global variables for the UI. some may be undefined
 */
export async function handleSelectionGeneric(numTk1P: number | undefined, numTk2P: number | undefined, addr1P: Address, addr2P: Address | undefined, isCurrent: boolean) {
    let routeP
    let dollars1P
    let dollars2P

    if (numTk1P) {
        // current box fully filled out
        // need to work out dollars again since different token
        dollars1P = await getDollarValue(addr1P, numTk1P); // TODO remove await, can handle async

        if (addr2P && isCurrent) {
            // other token selected as well
            routeP = await getRoute(addr1P, addr2P);
            numTk2P = await getOtherNumTokens(addr1P, addr2P, numTk1P, routeP);
            dollars2P = await getDollarValue(addr2P, numTk2P)
        } else if(addr2P && !isCurrent) {
            routeP = await getRoute(addr2P, addr1P);
            numTk1P = await getOtherNumTokens(addr2P, addr1P, numTk2P, routeP)
            dollars1P = await getDollarValue(addr1P, numTk1P)
        }
    } else if (addr2P && numTk2P) {
        routeP = await getRoute(addr1P, addr2P);
        numTk1P = await getOtherNumTokens(addr2P, addr1P, numTk2P, routeP);
        dollars1P = await getDollarValue(addr1P, numTk1P)

    }

    return {
        dollars1R: dollars1P,
        dollars2R: dollars2P,
        routeR: routeP,
        numTk1R: numTk1P,
        numTk2R: numTk2P
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


