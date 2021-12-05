import type { Bytes32, Uint256, Uint32, Address } from 'soltypes';
import { isProvided, provider, router, signer } from '$lib/stores';
import { ethers } from 'ethers'
import {ERC20} from '$lib/abis/ERC20';
import type { Ierc20 } from '$lib/typesUsed/Ierc20'
import type { Web3Provider, JsonRpcSigner } from '@ethersproject/providers';


let signer_val: JsonRpcSigner
let provider_val: Web3Provider

signer.subscribe(signer => {
    signer_val = signer
})
provider.subscribe(provider => {
    provider_val = provider
})

/**
 * 
 * @dev creates ERC20 contract instance at the relevant address and gets balance
 * @returns 
 */
export async function getBalance(address: string) {
    if (!provider_val || !signer_val) throw new Error("Provider or signer do not exist yet");
    const erc20Contract = new ethers.Contract(address, ERC20, provider_val) as Ierc20
    const bal = await erc20Contract.balanceOf(await signer_val.getAddress())
    console.log(bal)
    return 200;
}

export async function getOtherNumTokens(
    addr1: Address,
    addr2: Address,
    numTk1: number,
    route: Array<Address>
) {

    return Math.random() * 100;
};

export async function getDollarValue(addr: Address, numTk: number) { // TODO fix


    return numTk * Math.random() * 100;
}

export async function getRoute(addr1, addr2): Promise<Address[]> {



    async function checkPairExists(a1ddr: Address, addr2: Address) {
        return true; // query blockchain
    }

    return [addr1, addr2];
}




