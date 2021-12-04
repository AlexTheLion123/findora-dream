
import { getExactSwapData, getDollarValue, getRoute } from '$lib/scripts/Exchange/Swap';
import type { Bytes32, Uint256, Uint32, Address } from 'soltypes';

/**
 * 
 * @returns an object representing the correct state of the global variables for the UI. some may be undefined
 */
export async function handleSelectionGeneric(numTk1P: number, addr1P: Address, numTk2P: number, addr2P: Address, dollars1P: number, dollars2P: number) {
    let routeP

    if (numTk1P) {
        // need to work out dollars again since different token
        dollars1P = await getDollarValue(addr1P, numTk1P); // TODO remove await, can handle async

        if (addr2P) {
            routeP = await getRoute(addr1P, addr2P);
            numTk2P = await getExactSwapData(addr1P, addr2P, numTk1P, routeP);
            dollars2P = await getDollarValue(addr2P, numTk2P)
        }
    } else if (addr2P && numTk2P) {
        // no point in getting route separately if no inputs but both selected
        routeP = await getRoute(addr1P, addr2P);
        numTk1P = await getExactSwapData(addr2P, addr1P, numTk2P, routeP);
        dollars1P = await getDollarValue(addr1P, numTk1P)

    }

    

    const obj =  {
        dollars1R: dollars1P,
        dollars2R: dollars2P,
        routeR: routeP,
        numTk1R: numTk1P,
        numTk2R: numTk2P
    }
    console.log(obj);
    
    return obj;
}


export async function handleInputGeneric(numTk1P: number, addr1P: Address, numTk2P: number, addr2P: Address, dollars1P: number, dollars2P: number) {
    let routeP

    if (addr1P) {
        // token 1 selected
        dollars1P = await getDollarValue(addr1P, numTk1P);

        if (addr2P) {
            // token 2 also selected, then we can go ahead and get all data
            routeP = await getRoute(addr1P, addr2P);
            numTk2P = await getExactSwapData(addr1P, addr2P, numTk1P, routeP);
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


