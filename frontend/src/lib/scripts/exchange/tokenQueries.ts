import { ethers } from 'ethers'
import { NoRouteError, SamePairError } from './errors'; // TODO make errors extend Erc20Error
import { getErc20Balance, checkAddressAgainstNative, checkAddressExists, addDecimals, removeDecimals } from './utils';
import { ERC20ABI } from '$lib/abis';
import type { UniswapV2Factory, UniswapV2Router02, Ierc20 } from '$lib/typesUsed';
import type { Signer } from 'ethers';

/**
 * 
 * @param contractAddress address of the erc20 token
 * @param decimals erc20 token standard
 * @param _signer 
 * @param signerAddress better to have signeraddress already provided instead of querying blockchain again
 * @returns 
 */

// TODO see if we can remove .deployed()
export function getBalance(tokenAddress: string, decimals: number, signer: Signer, signerAddress: string): Promise<number> {
    return (new ethers.Contract(tokenAddress, ERC20ABI, signer) as Ierc20).deployed().then(res => getErc20Balance(res, signerAddress, decimals))
}

/**
 * @dev must be calculated by front-end or smart contract user. No helper functions in contract
 * For now, just check both tokens against the native. Add additional checks against other popular tokens as they get added
 * @param nativeAddr - address of the native token of that blockchain
 * @returns route with addr1 always as route[0]
 */

export async function getRoute(addr1: string, addr2: string, factory: UniswapV2Factory, nativeAddr: string): Promise<string[]> {
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

export function _getAmountsOut(
    numInput: number,
    decimalsIn: number,
    decimalsOut: number,
    route: string[],
    router: UniswapV2Router02
): Promise<number> {

    if (!route || route.length < 2) {
        throw new NoRouteError();
    }

    return router.getAmountsOut(addDecimals(numInput, decimalsIn), route)
        .then(res => removeDecimals(res[0], decimalsOut))
}


/**
 * @dev the way we calculate the route, it should necessarily be possible to calculate dollar value
 * @returns the exact dollar value of the input parameter, without taking slippage into account
 */
export async function getExactDollarValue({addrInput, dollarsAddr, numInput, nativeAddr, factory, router}: {
    addrInput: string,
    dollarsAddr: string,
    numInput: number, 
    nativeAddr: string,
    factory: UniswapV2Factory,
    router: UniswapV2Router02
}) { 

    return getRoute(addrInput, dollarsAddr, factory, nativeAddr)
    .then(_route=> {
        let current = numInput
        for(let i=0; i<_route.length-1; i++) {
            router.;
        }
    })

}

export async function approveMax(addressToken: string, addressSpender: string, signer: Signer) {
    let txn = await (new ethers.Contract(addressToken, ERC20ABI, signer) as Ierc20).deployed()
        .then(res => {
            res.connect(signer)
            return res.approve(addressSpender, ethers.constants.MaxUint256)
        })
    await txn.wait();
}



// done part manually, part calling the blockchain
// export async function getOtherNumTokens(
//     factory_addr: string,
//     numInput: number,
//     route: string[],
//     _signer: JsonRpcSigner
// ) {
//     if (!route || route.length < 2) {
//         throw new NoRouteError();
//     }

//     if (route.length === 2) {
//         return calcOutputFromPair(factory_addr, numInput, route[0], route[1], _signer)
//     }

//     // last item is destination, not pair
//     let currentNum = numInput;
//     for (let i = 0; i < (route.length - 1); i++) {
//         currentNum = await calcOutputFromPair(factory_addr, currentNum, route[i], route[i + 1], _signer)
//     }
//     return currentNum;
// }