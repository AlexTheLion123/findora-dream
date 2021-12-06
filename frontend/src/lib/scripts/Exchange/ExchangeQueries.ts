import { ethers } from 'ethers'
import { ERC20ABI } from '$lib/abis/ERC20ABI';
import type { MyToken } from '$lib/typesUsed/MyToken'
import type { JsonRpcSigner } from '@ethersproject/providers';
import { getErc20Balance, getSignerAddress, checkPairAgainstNative, checkAddressExists } from './ExchangeUtils';
import type { UniswapV2Factory } from '$lib/typesUsed/UniswapV2Factory';

export async function getBalance(address: string, _signer: JsonRpcSigner) {
    const erc20Contract = new ethers.Contract(address, ERC20ABI, _signer) as MyToken
    const bal = await getErc20Balance(erc20Contract, await getSignerAddress(_signer));
    return bal;
}

/**
 * @dev must be calculated by front-end or smart contract user. No helper functions in contract
 * For now, just check both tokens against the native. 
 * Add additional checks against other popular tokens as they get added
 */
export async function getRoute(addr1: string, addr2: string, factory: UniswapV2Factory, nativeAddr): Promise<string[] | void> {

    // check direct pair, returns zero address if no pair
    const pairAddress: string = await factory.getPair(addr1, addr2);
    if (!checkAddressExists(pairAddress)) {
        // check indirect pair against native, throws if no pair
        checkPairAgainstNative(factory, nativeAddr, addr1, addr2).catch(err => {
            alert(err);
            return
        })
        return [addr1, nativeAddr, addr2];
    }
    return [pairAddress];
}

export async function getOtherNumTokens(
    addr1: string,
    addr2: string,
    numTk1: number,
    route: Array<string>
) {
    // TODO next2
    return Math.random() * 100;
};

export async function getDollarValue(addr: string, numTk: number) { // TODO fix last probably
    return numTk * Math.random() * 100;
}


