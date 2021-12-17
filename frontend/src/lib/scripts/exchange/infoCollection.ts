import { NoRouteError, SamePairError } from '.';
import { checkAddressAgainstNative, checkAddressExists, getPairAddress, removeDecimals, precisionDivision } from '.'
import { Contract } from 'ethers'
import { ERC20ABI } from '$lib/abis';
import type { UniswapV2Factory, Ierc20, UniswapV2Router02 } from '$lib/typesUsed'
import type { Signer, BigNumber } from 'ethers'

/**
 * All these exported methods are called from the frontend to update display and component values
 */

/**
 * @dev gets all the data required for a swap, starting from the route and numInput
 * @param isInput boolean that determines whether the number provided in the input or the output
 */
export async function getAllInOrOut({ addrIn, addrOut, amount, nativeAddr, factory, router, isInput }: {
    addrIn: string,
    addrOut: string,
    amount: BigNumber,
    factory: UniswapV2Factory,
    nativeAddr: string,
    router: UniswapV2Router02
    isInput: boolean
}) {
    return getRoute({ addrIn: addrIn, addrOut: addrOut, factory: factory, nativeAddr: nativeAddr })
        .then(async _route => {
            let amounts: BigNumber[];
            if (isInput) {
                amounts = await router.getAmountsOut(amount, _route)
            } else {
                amounts = await router.getAmountsIn(amount, _route)
            }
            return amounts[amounts.length - 1]
        });
}

/// @returns true if sufficient allowance
export async function checkSufficientAllowance({ toSpend, ownerAddr, spenderAddr, tokenAddr, signer }: {
    toSpend: BigNumber, ownerAddr: string, spenderAddr: string, tokenAddr: string, signer: Signer
}): Promise<boolean> {
    const tokenInstance = new Contract(tokenAddr, ERC20ABI, signer) as Ierc20
    return (await tokenInstance.allowance(ownerAddr, spenderAddr)).lt(toSpend) ? false : true;
}


// TODO look at cacheing routes
// TODO change logic to accomodate array of main tokens instead of nativeAddr
export async function getRoute({ addrIn, addrOut, factory, nativeAddr }: {
    addrIn: string,
    addrOut: string,
    factory: UniswapV2Factory,
    nativeAddr: string
}): Promise<string[]> {
    if (addrIn === addrOut) {
        throw new SamePairError();
    }

    const pairAddress = await factory.getPair(addrIn, addrOut); // we have to query blockchain, and can't use pairfor, because pair might not exist

    if (checkAddressExists(pairAddress)) {
        return [addrIn, addrOut]
    }

    if (await checkAddressAgainstNative(factory, nativeAddr, addrIn) && await checkAddressAgainstNative(factory, nativeAddr, addrOut)) {
        // check indirect pair against native, throws if no pair
        return [addrIn, nativeAddr, addrOut];
    }

    // if this point is reached, no route exists and returns empty array
    throw new NoRouteError();
}

// export async function getQuoteFromRoute({route, router}: {route: string[], router: UniswapV2Router02}) {
//     for(let i=0; i<route.length-1; i++) {
//         router.getReserves()
//     }
// }


export function getBalance(tokenAddress: string, signer: Signer, signerAddress: string): Promise<BigNumber> {
    return (new Contract(tokenAddress, ERC20ABI, signer) as Ierc20).balanceOf(signerAddress);
}

export function getTotalSupply(tokenAddress: string, signer: Signer, signerAddress: string): Promise<BigNumber> {
    return (new Contract(tokenAddress, ERC20ABI, signer) as Ierc20).totalSupply();
}

export async function getDecimals(tokenAddress: string, signer: Signer): Promise<number> {
    return (new Contract(tokenAddress, ERC20ABI, signer) as Ierc20).decimals()
}

export async function getSymbol(tokenAddress: string, signer: Signer): Promise<string> {
    return (new Contract(tokenAddress, ERC20ABI, signer) as Ierc20).symbol();
}

