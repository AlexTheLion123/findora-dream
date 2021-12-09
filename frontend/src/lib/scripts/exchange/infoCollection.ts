import { getAmountsAndReservesOut, getAllowance } from './utils/swapUtils'
import { NoRouteError, SamePairError } from '.';
import {  checkAddressAgainstNative, checkAddressExists } from './utils/utils'
import type { Signer, BigNumber} from 'ethers'
import type { UniswapV2Factory, Ierc20 } from '$lib/typesUsed'

/**
 * All these exported methods are called from the frontend to update display and component values
 */

export async function getNumOutputAndPIFromRoute({ route, numInput, factoryAddr, signer }: {
    route: string[],
    numInput: BigNumber,
    factoryAddr: string,
    signer: Signer
}) {
    const { reservesArr, amountsOutArr } = await getAmountsAndReservesOut({ route: route, numInput: numInput, factoryAddr: factoryAddr, signer: signer })
    const numOutput = amountsOutArr[amountsOutArr.length - 1];
    const priceImpact = getPI({ reservesArr, amountsOutArr }, numInput)
    return {
        numOutput: numOutput,
        priceImpact: priceImpact
    }

}

function getPI({ reservesArr, amountsOutArr }: Awaited<ReturnType<typeof getAmountsAndReservesOut>>, numInput: BigNumber) {
    let currentNum = numInput
    _quoteFromRerservesArr(numInput, reservesArr)
    return _calcPI({ quoteOutput: numInput, actualOutput: currentNum })
}

function _quoteFromRerservesArr(numInput: BigNumber, reservesArr: {reserve0: BigNumber, reserve1: BigNumber}[]) {
    let currentNum = numInput
    for (let i = 0; i < reservesArr.length; i++) {
        const quote = _quote({ amountsIn: currentNum, reserveIn: reservesArr[i].reserve0, reserveOut: reservesArr[i].reserve1 })
        currentNum = quote;
    }
    return currentNum
}

function _quote({ amountIn, reserveIn, reserveOut }: { [k: string]: BigNumber }) {
    return amountIn.mul(reserveOut).div(reserveIn)
}

function _calcPI({ quoteOutput, actualOutput }: { quoteOutput: BigNumber, actualOutput: BigNumber }) {
    return 1 - actualOutput.div(quoteOutput).toNumber()
}

export async function getDollarsBoth({ addrInput, numInput, priceImpact }: {
    addrInput: string,
    numInput: number,
    priceImpact: number
}) {
    const dollarsInput = 23423;
    const dollarsOutput = dollarsInput * priceImpact;

    return {
        dollarsInput: dollarsInput,
        dollarsOuput: dollarsOutput
    }
}

export async function checkAllowance({ toSpend, ownerAddr, spenderAddr, tokenAddr, signer }: {
    toSpend: BigNumber, ownerAddr: string, spenderAddr: string, tokenAddr: string, signer: Signer
}): Promise<boolean> {
    return await getAllowance({
        tokenAddr: tokenAddr,
        ownerAddr: ownerAddr,
        spenderAddr: spenderAddr,
        signer: signer
    }) < toSpend ? false : true;

}

/**
 * @dev the way we calculate the route, it should necessarily be possible to calculate dollar value
 * @returns used to return the exact dollar value of the input parameter, without taking price impact into account.
 */

 export async function getQuote({ addrInput, dollarsAddr, numInput, nativeAddr, factory, signer }: {
    addrInput: string,
    dollarsAddr: string,
    numInput: BigNumber,
    nativeAddr: string,
    factory: UniswapV2Factory,
    signer: Signer
}) {

    return getRoute({addr1: addrInput, addr2: dollarsAddr, factory: factory, nativeAddr: nativeAddr})
        .then(async _route => getAmountsAndReservesOut({route: _route, numInput: numInput, factoryAddr: factory.address, signer: signer}))
        .then((value: { reservesArr: { reserve0: BigNumber; reserve1: BigNumber; }[]; amountsOutArr: BigNumber[]; }) => _quoteFromRerservesArr(numInput, value.reservesArr))
        
}

// TODO change logic to accomodate array of main tokens instead of nativeAddr
export async function getRoute({addr1, addr2, factory, nativeAddr}: {
    addr1: string,
    addr2: string,
    factory: UniswapV2Factory,
    nativeAddr: string
}): Promise<string[]> {
    if (addr1 === addr2) {
        throw new SamePairError();
    }

    const pairAddress = await factory.getPair(addr1, addr2); // we have to query blockchain, and can't use pairfor, because pair might not exist

    if (checkAddressExists(pairAddress)) {
        return [addr1, addr2]
    }

    if (await checkAddressAgainstNative(factory, nativeAddr, addr1) && await checkAddressAgainstNative(factory, nativeAddr, addr2)) {
        // check indirect pair against native, throws if no pair
        return [addr1, nativeAddr, addr2];
    }

    // if this point is reached, no route exists and returns empty array
    throw new NoRouteError();
}





