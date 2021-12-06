import type { Bytes32, Uint256, Uint32, Address } from 'soltypes';
import { router, signer, factory } from '$lib/stores';
import { ethers } from 'ethers'
import { ERC20ABI } from '$lib/abis/ERC20ABI';
import type { MyToken } from '$lib/typesUsed/MyToken'
import type { JsonRpcSigner } from '@ethersproject/providers';
import { getErc20Balance, getSignerAddress } from './Exchange_utils';
// import { ProviderError } from './Errors'
import { SignerError, FactoryDNE } from './Errors'
import type { UniswapV2Router02 } from '$lib/typesUsed/UniswapV2Router02';
import type { UniswapV2Factory } from '$lib/typesUsed/UniswapV2Factory';

let signer_val: JsonRpcSigner | undefined
let factory_val: UniswapV2Factory
// let provider_val: Web3Provider | undefined
// let router_val: UniswapV2Router02 | undefined;

signer.subscribe(signer => {
    signer_val = signer
})
factory.subscribe(value => {
    factory_val = value
})

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
export async function getRoute(addr1, addr2): Promise<Address[]> {
    if (!factory_val) throw new FactoryDNE("Factory does not exist yet");

    const address: string | void = await factory_val.getPair(addr1, addr2).catch(console.log);
    console.log(address)
    // TODO next, for now only checks against native
    async function checkPairExists(a1ddr: Address, addr2: Address) {
        return true; // query blockchain
    }

    return [addr1, addr2];
}

export async function getOtherNumTokens(
    addr1: Address,
    addr2: Address,
    numTk1: number,
    route: Array<Address>
) {
    // TODO next2
    return Math.random() * 100;
};



export async function getDollarValue(addr: Address, numTk: number) { // TODO fix last probably
    return numTk * Math.random() * 100;
}


