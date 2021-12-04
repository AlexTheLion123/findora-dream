
import { getExactSwapData, getDollarValue, getRoute } from '$lib/scripts/Exchange/Swap';
import type { Bytes32, Uint256, Uint32, Address } from 'soltypes';

export async function handleSelectionGeneric(numTk1P, addr1P, numTk2P, addr2P) {
    let dollars1R: number | undefined;
    let dollars2R: number | undefined;
    let routeR: Address[] | undefined;
    let numTk1R: number | undefined;
    let numTk2R: number | undefined;

    if (numTk1P) {
        // need to work out dolars again since different token
        const dollars1R = await getDollarValue(addr1P, numTk1P); // TODO remove await, can handle async

        if (addr2P) {
            routeR = await getRoute(addr1P, addr2P);
            numTk2R = await getExactSwapData(addr1P, addr2P, numTk1P, routeR);
            dollars2R = await getDollarValue(addr2P, numTk2P)
        }
    } else if (addr2P && numTk2P) {
        // no point in getting route separately if no inputs but both selected
        routeR = await getRoute(addr1P, addr2P);
        numTk1R = await getExactSwapData(addr2P, addr1P, numTk2P, routeR);
        dollars1R = await getDollarValue(addr1P, numTk1P)

    }

    return {
        dollars1R: dollars1R,
        dollars2R: dollars2R,
        routeR: routeR,
        numTk1R: numTk1R,
        numTk2R: numTk2R
    }
}


export async function handleInputGeneric(numTk1P, addr1P, numTk2P, addr2P) {
    let dollars1R: number | undefined;
    let dollars2R: number | undefined;
    let routeR: Address[] | undefined;
    let numTk1R: number | undefined;
    let numTk2R: number | undefined;

    if (addr1P) {
        // token 1 selected
        dollars1R = await getDollarValue(addr1P, numTk1P);

        if (addr2P) {
            // token 2 also selected, then we can go ahead and get all data
            routeR = await getRoute(addr1P, addr2P);
            numTk2R = await getExactSwapData(addr1P, addr2P, numTk1P, routeR);
            dollars2R = await getDollarValue(addr2P, numTk2R);
        }
    }

    // we don't care if only token2 is selected this is handled by token2 selection event
    // And of course, we also don't care if neither are selected.

    return {
        dollars1R: dollars1R,
        dollars2R: dollars2R,
        routeR: routeR,
        numTk1R: numTk1R,
        numTk2R: numTk2R
    }
}


