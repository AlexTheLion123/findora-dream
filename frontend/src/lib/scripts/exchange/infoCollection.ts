import { getAmountsAndReservesInOrOut, getAllowance } from './utils/swapUtils'
import { NoRouteError, SamePairError } from '.';
import { checkAddressAgainstNative, checkAddressExists, removeDecimals, precisionDivision } from './utils/utils'
import type { Signer, BigNumber} from 'ethers'
import type { UniswapV2Factory, Ierc20 } from '$lib/typesUsed'
import {Contract, utils } from 'ethers'
import { ERC20ABI } from '$lib/abis';

/**
 * All these exported methods are called from the frontend to update display and component values
 */

/**
 * @dev gets all the data required for a swap, starting from the route and numInput
 * @param isInput boolean that determines whether the number provided in the input or the output
 * Routes are reversible, so can calculate either way
 */
export async function getAll({ addrP, addrQ, numInputOrOutput, factory, nativeAddr, signer, isInput }: {
    addrP: string,
    addrQ: string,
    numInputOrOutput: BigNumber,
    factory: UniswapV2Factory,
    nativeAddr: string,
    signer: Signer,
    isInput: boolean
}): Promise<{
    numInputOrOutput: BigNumber;
    priceImpact: number;
    route: string[]}> 
    {    
    return getRoute({ addrInput: addrP, addrOutput: addrQ, factory: factory, nativeAddr: nativeAddr })
        .then(async res => {
            const {numInputOrOutput: num, priceImpact} = await getNumInputOrOutputAndPIFromRoute({ route: res, numInputOrOutput: numInputOrOutput, factoryAddr: factory.address, signer: signer, isInput: isInput })

            return {
                numInputOrOutput: num,
                priceImpact: priceImpact,
                route: res
            }
        })
}

export async function getNumInputOrOutputAndPIFromRoute({ route, numInputOrOutput, factoryAddr, signer, isInput }: {
    route: string[],
    numInputOrOutput: BigNumber,
    factoryAddr: string,
    signer: Signer,
    isInput: boolean
}) {
    const { reservesArr, amountsArr } = await getAmountsAndReservesInOrOut({ route: route, numInputOrOutput: numInputOrOutput, factoryAddr: factoryAddr, signer: signer, isInput: isInput })
    const result = amountsArr[amountsArr.length - 1];
    console.log("amountsArr: ", amountsArr.map(item => removeDecimals(item, 18)))
    let priceImpact: number;
    
    if(isInput) {
        priceImpact = getPI({ reservesArr, amountsArr }, numInputOrOutput, result)

    } else {
        priceImpact = getPI({ reservesArr, amountsArr }, result, numInputOrOutput)
    }

    return {
        numInputOrOutput: result,
        priceImpact: priceImpact
    }

}

/// @dev calculates price impact by getting a quote (i.e. no price impact) based on the numInput
function getPI({ reservesArr }: Awaited<ReturnType<typeof getAmountsAndReservesInOrOut>>, numInput: BigNumber, numOutput: BigNumber) {
    const quoteOutput = _quoteFromRerservesArr(numInput, reservesArr)
    return _calcPI({ quoteOutput: quoteOutput, actualOutput: numOutput })
}

function _quoteFromRerservesArr(numInput: BigNumber, reservesArr: { reserve0: BigNumber, reserve1: BigNumber }[]) {
    let currentNum = numInput
    for (let i = 0; i < reservesArr.length; i++) {
        const quote = _quote({ amountIn: currentNum, reserveIn: reservesArr[i].reserve0, reserveOut: reservesArr[i].reserve1 })
        currentNum = quote;
    }
    return currentNum
}

function _quote({ amountIn, reserveIn, reserveOut }: { // TODO fix numbers, loses decimals
    amountIn: BigNumber,
    reserveIn: BigNumber,
    reserveOut: BigNumber
}) {
    return amountIn.mul(reserveOut).div(reserveIn)
}

function _calcPI({ quoteOutput, actualOutput }: { quoteOutput: BigNumber, actualOutput: BigNumber }) {
    /**
     * assuming quoteOutput < actualOutput, so we know already that division without decimal = 0
     * so we simply mod to get fractional part
     */
    return 1 - precisionDivision(actualOutput, quoteOutput)
}

/// @returns true if sufficient allowance
export async function checkSufficientAllowance({ toSpend, ownerAddr, spenderAddr, tokenAddr, signer }: {
    toSpend: BigNumber, ownerAddr: string, spenderAddr: string, tokenAddr: string, signer: Signer
}): Promise<boolean> {
    return ((await getAllowance({
        tokenAddr: tokenAddr,
        ownerAddr: ownerAddr,
        spenderAddr: spenderAddr,
        signer: signer
    })).lt(toSpend)) ? false : true;
}

/**
 * @dev used to calculate dollar value
 * the way we calculate the route, it should necessarily be possible to calculate dollar value
 * @returns used to return the exact dollar value of the input parameter, without taking price impact into account.
 */
// TODO fix so that uses route as input
export async function getQuote({ addrInput, addrOutput, numInput, nativeAddr, factory, signer }: {
    addrInput: string,
    addrOutput: string,
    numInput: BigNumber,
    nativeAddr: string,
    factory: UniswapV2Factory,
    signer: Signer
}) {
    return getRoute({ addrInput: addrInput, addrOutput: addrOutput, factory: factory, nativeAddr: nativeAddr })
        .then(async _route => {
            return getAmountsAndReservesInOrOut({ route: _route, numInputOrOutput: numInput, factoryAddr: factory.address, signer: signer, isInput: true }) // since don't care about PI here, doesn't matter whether input or output
        })
        .then((value: { reservesArr: { reserve0: BigNumber; reserve1: BigNumber; }[]}) => {
            return _quoteFromRerservesArr(numInput, value.reservesArr)
        })
}

// TODO look at cacheing routes
// TODO change logic to accomodate array of main tokens instead of nativeAddr
export async function getRoute({ addrInput, addrOutput, factory, nativeAddr }: {
    addrInput: string,
    addrOutput: string,
    factory: UniswapV2Factory,
    nativeAddr: string
}): Promise<string[]> {
    if (addrInput === addrOutput) {
        throw new SamePairError();
    }

    const pairAddress = await factory.getPair(addrInput, addrOutput); // we have to query blockchain, and can't use pairfor, because pair might not exist

    if (checkAddressExists(pairAddress)) {
        return [addrInput, addrOutput]
    }

    if (await checkAddressAgainstNative(factory, nativeAddr, addrInput) && await checkAddressAgainstNative(factory, nativeAddr, addrOutput)) {
        // check indirect pair against native, throws if no pair
        return [addrInput, nativeAddr, addrOutput];
    }

    // if this point is reached, no route exists and returns empty array
    throw new NoRouteError();
}


export function getBalance(tokenAddress: string, signer: Signer, signerAddress: string): Promise<BigNumber> {
    return (new Contract(tokenAddress, ERC20ABI, signer) as Ierc20).balanceOf(signerAddress);
}

export async function getDecimals(tokenAddress: string, signer: Signer): Promise<number> {
    return (new Contract(tokenAddress, ERC20ABI, signer) as Ierc20).decimals()
}


