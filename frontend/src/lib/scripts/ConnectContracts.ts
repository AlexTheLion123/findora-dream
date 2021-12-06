import { FACTORY_ADDRESS, ROUTER_ADDRESS } from '$lib/stores'; // not subscribing
import type {Writable} from 'svelte/store'
import { ethers } from 'ethers';
import deployments from '$lib/assets/deployments.json';
import {UniswapV2FactoryABI} from '$lib/abis/UniswapV2FactoryABI';
import {UniswapV2Router02ABI} from '$lib/abis/UniswapV2Router02ABI';
import type { UniswapV2Router02 } from '$lib/typesUsed/UniswapV2Router02';
import type { UniswapV2Factory } from '$lib/typesUsed/UniswapV2Factory';
import type { JsonRpcSigner } from '@ethersproject/providers';


// TODO move to another file?
// set immediately on loading of swap/liquidity component, don't care whether provider exists
export function setAndGetFactoryAndRouterAddress() {
    let factory: string | undefined;
    let router: string | undefined; 

    deployments.map(({ contract, address }) => {
        if (contract === 'UniswapV2Factory') {
            FACTORY_ADDRESS.set(address)
            factory = address;
        } else if (contract === 'UniswapV2Router02') {
            ROUTER_ADDRESS.set(address)
            router = address;
        }
    }) as unknown as string;

    if(!(factory && router)) throw "This should never happen, make sure deployment files are in correct location in frontend files";

    console.log("factory and router address set")
    return {factory_address: factory, router_address: router}
}

export async function signRouterAndFactory(_router: Writable<null | UniswapV2Router02>, _factory: Writable<null | UniswapV2Factory>, router_addr: string, factory_addr: string, signer: JsonRpcSigner) {
    _router.set(await new ethers.Contract(router_addr, UniswapV2Router02ABI, signer) as UniswapV2Router02)
    _factory.set(await new ethers.Contract(factory_addr, UniswapV2FactoryABI, signer) as UniswapV2Factory)
    console.log("router and factory signed")
}