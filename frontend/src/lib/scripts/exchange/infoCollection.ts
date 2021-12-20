import { NoRouteError, SamePairError } from '.';
import { checkAddressAgainstNative, checkAddressExists, getPairAddress, removeDecimals, getReservesQuery } from '.'
import { constants, Contract } from 'ethers'
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
    return toSpend.lt(await tokenInstance.allowance(ownerAddr, spenderAddr)) ? true : false;
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

export function getBalance(tokenAddress: string, signer: Signer, signerAddress: string): Promise<BigNumber> {
    return (new Contract(tokenAddress, ERC20ABI, signer) as Ierc20).balanceOf(signerAddress);
}

export function getTotalSupply(tokenAddress: string, signer: Signer, signerAddress: string): Promise<BigNumber> {
    return (new Contract(tokenAddress, ERC20ABI, signer) as Ierc20).totalSupply();
}

export function getDecimals(tokenAddress: string, signer: Signer): Promise<number> {
    return (new Contract(tokenAddress, ERC20ABI, signer) as Ierc20).decimals()
}

export function getSymbol(tokenAddress: string, signer: Signer): Promise<string> {
    return (new Contract(tokenAddress, ERC20ABI, signer) as Ierc20).symbol();
}

export function getAllowance({tokenAddress, signer, signerAddr, spenderAddr} : {tokenAddress: string, signer: Signer, signerAddr: string, spenderAddr: string}): Promise<BigNumber> {
    return (new Contract(tokenAddress, ERC20ABI, signer) as Ierc20).allowance(signerAddr, spenderAddr);
}

export async function getPosition({ addr1, addr2, factoryAddr, signer, signerAddr, pairAddr, symbol1, symbol2 }: {
    addr1: string, addr2: string, factoryAddr: string, signer: Signer, signerAddr: string, pairAddr?: string, symbol1?: string, symbol2?: string
}) {
    const pairAddress = pairAddr || getPairAddress(factoryAddr, addr1, addr2);

    try {
        const balance = removeDecimals(await getBalance(pairAddress, signer, signerAddr), 18);
        const supply = removeDecimals(await getTotalSupply(pairAddress, signer, signerAddr), 18)

        // TODO look at promise.all
        const sym1 = symbol1 || await getSymbol(addr1, signer);
        const sym2 = symbol2 || await getSymbol(addr2, signer);

        const decimals1 = await getDecimals(addr1, signer);
        const decimals2 = await getDecimals(addr1, signer);

        const [_reserve0, _reserve1] = await getReservesQuery({ factoryAddr: factoryAddr, addrInput: addr1, addrOutput: addr2, signer: signer, pairAddr: pairAddress })
        const reserve1 = removeDecimals(_reserve0, decimals1);
        const reserve2 = removeDecimals(_reserve1, decimals2);

        const balance1 = balance / supply * reserve1;
        const balance2 = balance / supply * reserve2;

        return {
            pair: {
                address: pairAddress,
                balance: balance,
                symbol: `${sym1} - ${sym2}`,
                decimals: 18,
                share: balance / supply
            },
            tokenA: {
                address: addr1,
                balance: balance1,
                symbol: sym1,
                decimals: decimals1
            },
            tokenB: {
                address: addr2,
                balance: balance2,
                symbol: sym2,
                decimals: decimals2
            }
        };
    } catch (e) {
        throw "No position"
    }


}