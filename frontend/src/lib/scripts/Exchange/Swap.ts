import type { Bytes32, Uint256, Uint32, Address } from 'soltypes';
import { isProvided, provider, router, signer } from '$lib/stores';
import { ethers } from 'ethers'
import {ERC20ABI} from '$lib/abis/ERC20ABI';
import type { MyToken } from '$lib/typesUsed/MyToken'
import type { Web3Provider, JsonRpcSigner } from '@ethersproject/providers';
import { ProviderError } from './Errors'
import type { UniswapV2Router02} from '$lib/typesUsed/UniswapV2Router02';

let signer_val: JsonRpcSigner | undefined
let provider_val: Web3Provider | undefined
let router_val: UniswapV2Router02 | undefined;

signer.subscribe(signer => {
    signer_val = signer
})
provider.subscribe(provider => {
    provider_val = provider
})
router.subscribe(router => {
    router_val = router
})

/**
 * 
 * @dev creates ERC20 contract instance at the relevant address and gets balance
 * @returns 
 */
export async function getBalance(address: string) {
    if (!provider_val || !signer_val) throw new ProviderError("Provider or signer do not exist yet");
    const erc20Contract = new ethers.Contract(address, ERC20ABI, provider_val) as MyToken
    const bal = await getErc20Balance(erc20Contract, await getSignerAddress(signer_val));
    return bal;
}

async function getErc20Balance(contract: MyToken, address: string) {
    return (await contract.balanceOf(address)).div(ethers.constants.WeiPerEther).toString();
}

async function getSignerAddress(signer: JsonRpcSigner) {
    return await signer_val.getAddress()
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

/**
 * @dev must be calculated by front-end or smart contract user. No helper functions in contract
 * For now, just check both tokens against the native. 
 * Add additional checks against other popular tokens as they get added
 */
export async function getRoute(addr1, addr2): Promise<Address[]> { 
    if(!router_val) return

    router_val.get
    // TODO next, for now only checks against native
    async function checkPairExists(a1ddr: Address, addr2: Address) {
        return true; // query blockchain
    }

    return [addr1, addr2];
}




