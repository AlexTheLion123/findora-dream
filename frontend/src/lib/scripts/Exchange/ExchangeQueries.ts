import { ethers } from 'ethers'
import { ERC20ABI } from '$lib/abis/ERC20ABI';
import { UniswapV2PairABI } from '$lib/abis/UniswapV2PairABI';
import type { MyToken } from '$lib/typesUsed/MyToken'
import type { JsonRpcSigner } from '@ethersproject/providers';
import { getErc20Balance, getSignerAddress, checkAddressAgainstNative, checkAddressExists } from './ExchangeUtils';
import type { UniswapV2Factory } from '$lib/typesUsed/UniswapV2Factory';
import type { UniswapV2Pair } from '$lib/typesUsed/UniswapV2Pair';
import { calcOutputFromPair } from './ExchangeUtils';

export async function getBalance(contract_address: string, _signer: JsonRpcSigner) {
    // test below
    // const cont = await new ethers.Contract('0xCfEB869F69431e42cdB54A4F4f105C19C080A601', ERC20ABI, _signer) as MyToken;
    // test above
    console.log(contract_address)
    const erc20Contract = await new ethers.Contract(contract_address, ERC20ABI, _signer) as MyToken

    const bal = await getErc20Balance(erc20Contract, await getSignerAddress(_signer));
    return bal;
}

/**
 * @dev must be calculated by front-end or smart contract user. No helper functions in contract
 * For now, just check both tokens against the native. 
 * Add additional checks against other popular tokens as they get added
 * @param nativeAddr - address of the native token of that blockchain
 * @param finalDest - address of the account to send the final output tokens to
 */
export async function getRoute(addr1: string, addr2: string, factory: UniswapV2Factory, nativeAddr): Promise<string[] | null> {
    if (addr1 === addr2) {
        alert("same pair");
        return
    }

    const pairAddress = await factory.getPair(addr1, addr2);
    if (checkAddressExists(pairAddress)) return [addr1, addr2]

    // check indirect pair against native, throws if no pair
    if (await checkAddressAgainstNative(factory, nativeAddr, addr1) && await checkAddressAgainstNative(factory, nativeAddr, addr2)) {
        return [addr1, nativeAddr, addr2];
    }

    // if no route, returns empty array
    alert("No route, be the first to add liquidity")
    return null
}

export async function getOtherNumTokens(
    factory_addr: string,
    addr1: string,
    addr2: string,
    numTk1: number,
    route: Array<string>,
    _signer: JsonRpcSigner
): Promise<number> {

    if (route.length === 2) {
        return calcOutputFromPair(factory_addr, numTk1, route[0], route[1], _signer)
    }

    // last item is destination, not pair
    let currentNum = numTk1;
    for (let i = 0; i < (route.length - 1); i++) {
        currentNum = await calcOutputFromPair(factory_addr, currentNum, route[i], route[i+1], _signer)
    }
    return currentNum;
}

export async function getDollarValue(addr: string, numTk: number) { // TODO fix last probably
    return numTk * Math.random() * 100;
}


