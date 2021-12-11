import { getAmountsAndReservesOut, getAllowance } from './utils/swapUtils'
import { NoRouteError, SamePairError } from '.';
import { checkAddressAgainstNative, checkAddressExists } from './utils/utils'
import type { Signer, BigNumber} from 'ethers'
import type { UniswapV2Factory, Ierc20 } from '$lib/typesUsed'
import {Contract, utils } from 'ethers'
import { ERC20ABI } from '$lib/abis';

/**
 * All these exported methods are called from the frontend to update display and component values
 */

/// @dev gets all the data required for a swap, starting from the route and numInput
export async function getAll({ addrInput, addrOutput, numInput, factory, nativeAddr, signer }: {
    addrInput: string,
    addrOutput: string,
    numInput: BigNumber,
    factory: UniswapV2Factory,
    nativeAddr: string,
    signer: Signer
}) {    
    return getRoute({ addrInput: addrInput, addrOutput: addrOutput, factory: factory, nativeAddr: nativeAddr })
        .then(async res => {
            const {numOutput, priceImpact} = await getNumOutputAndPIFromRoute({ route: res, numInput: numInput, factoryAddr: factory.address, signer: signer })

            return {
                numOutput: numOutput,
                priceImpact: priceImpact,
                route: res
            }
        })
}


export async function getNumOutputAndPIFromRoute({ route, numInput, factoryAddr, signer }: {
    route: string[],
    numInput: BigNumber,
    factoryAddr: string,
    signer: Signer
}) {
    const { reservesArr, amountsOutArr } = await getAmountsAndReservesOut({ route: route, numInput: numInput, factoryAddr: factoryAddr, signer: signer })
    const numOutput = amountsOutArr[amountsOutArr.length - 1];
    const priceImpact = getPI({ reservesArr, amountsOutArr }, numInput, numOutput)
    return {
        numOutput: numOutput,
        priceImpact: priceImpact
    }

}

/// @dev calculates price impact by getting a quote (i.e. no price impact) based on the numInput
function getPI({ reservesArr }: Awaited<ReturnType<typeof getAmountsAndReservesOut>>, numInput: BigNumber, numOutput: BigNumber) {
    console.log("getting price impact")
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

    const num1 = quoteOutput.mod(actualOutput).div(utils.parseUnits("10", 10))
    const num2 = quoteOutput.div(utils.parseUnits("10", 10))
    return num1.toNumber()/num2.toNumber()
    
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
    return getRoute({ addrInput: addrInput, addrOutput: dollarsAddr, factory: factory, nativeAddr: nativeAddr })
        .then(async _route => getAmountsAndReservesOut({ route: _route, numInput: numInput, factoryAddr: factory.address, signer: signer }))
        .then((value: { reservesArr: { reserve0: BigNumber; reserve1: BigNumber; }[]; amountsOutArr: BigNumber[]; }) => _quoteFromRerservesArr(numInput, value.reservesArr))

}

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


