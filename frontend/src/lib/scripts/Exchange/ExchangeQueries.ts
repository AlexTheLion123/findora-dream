import { router, signer, factory, nativeTokenAddress } from '$lib/stores';
import { ethers } from 'ethers'
import { ERC20ABI } from '$lib/abis/ERC20ABI';
import type { MyToken } from '$lib/typesUsed/MyToken'
import type { JsonRpcSigner } from '@ethersproject/providers';
import { getErc20Balance, getSignerAddress, checkPairAgainstNative, checkAddressExists } from './ExchangeUtils';
// import { ProviderError } from './Errors'
import { SignerError, FactoryDNE, NoRouteError } from './Errors'
import type { UniswapV2Router02 } from '$lib/typesUsed/UniswapV2Router02';
import type { UniswapV2Factory } from '$lib/typesUsed/UniswapV2Factory';
import { check } from 'prettier';

let signer_val: JsonRpcSigner | undefined
let factory_val: UniswapV2Factory | undefined
let nativeAddress_val: string
// let provider_val: Web3Provider | undefined
// let router_val: UniswapV2Router02 | undefined;

signer.subscribe(value => signer_val = value)
factory.subscribe(value => factory_val = value)
nativeTokenAddress.subscribe(value => nativeAddress_val = value)

/// @dev creates ERC20 contract instance at the relevant address and gets balance
export async function getBalance(address: string) {
    if (!signer_val) throw new SignerError("Provider or signer do not exist yet");
    const erc20Contract = new ethers.Contract(address, ERC20ABI, signer_val) as MyToken
    const bal = await getErc20Balance(erc20Contract, await getSignerAddress(signer_val));
    return bal;
}

/**
 * @dev must be calculated by front-end or smart contract user. No helper functions in contract
 * For now, just check both tokens against the native. 
 * Add additional checks against other popular tokens as they get added
 */
export async function getRoute(addr1, addr2): Promise<string[]> {
    if (!factory_val) throw new FactoryDNE("Factory does not exist yet");

    // check direct pair, returns zero address if no pair
    const pairAddress: string = await factory_val.getPair(addr1, addr2);
    if (!checkAddressExists(pairAddress)) {
        // check indirect pair against native, throws if no pair
        checkPairAgainstNative(factory_val, nativeAddress_val, addr1, addr2).catch(err => {
            alert(err);
            return
        })
        return [addr1, nativeTokenAddress, addr2];
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


