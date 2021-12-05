import { signer, router, factory, FACTORY_ADDRESS, ROUTER_ADDRESS } from '$lib/stores';
import { ethers } from 'ethers';
import deployments from '$lib/assets/deployments.json';
import {UniswapV2FactoryABI} from '$lib/abis/UniswapV2FactoryABI';
import {UniswapV2Router02ABI} from '$lib/abis/UniswapV2Router02ABI';
import type { UniswapV2Router02 } from '$lib/typesUsed/UniswapV2Router02';
import type { UniswapV2Factory } from '$lib/typesUsed/UniswapV2Factory';
import {SignerError} from './Exchange/Errors'
import {RouterAddressNotSetError} from './Exchange/Errors'
// import type {UniswapV2Factory} from '$lib/typesUsed/UniswapV2Factory'
// import type {UniswapV2Router02} from '$lib/typesUsed/UniswapV2Router02'


// all contract connection functions declared here to save on memory (subscriptions)
// TODO worry about unsubscribing to stores, especially address stores, can maybe get address from contract object?

let signer_val;
let factory_address_val;
let router_address_val;

signer.subscribe(value => signer_val = value)
FACTORY_ADDRESS.subscribe(value => factory_address_val = value)
ROUTER_ADDRESS.subscribe(value => router_address_val = value)

export function setFactoryAndRouterAddress() {
    // set immediately on loading of swap/liquidity component, don't care whether provider exists
    deployments.map(({ contract, address }) => {
        if (contract === 'UniswapV2Factory') {
            FACTORY_ADDRESS.set(address)
        } else if (contract === 'UniswapV2Router02') {
            ROUTER_ADDRESS.set(address)
        }
    }) as unknown as string;

    console.log("factory and router address set")
}

export async function signRouterAndFactory() {
    if(!signer_val) throw new SignerError("No signer"); // TODO possibly remove this line since only invoked after checking existence of provider
    if(!factory_address_val || !router_address_val) throw new RouterAddressNotSetError("Router not set");
    
    router.set(await new ethers.Contract(router_address_val, UniswapV2Router02ABI, signer_val) as UniswapV2Router02)
    factory.set(await new ethers.Contract(factory_address_val, UniswapV2FactoryABI, signer_val) as UniswapV2Factory)

    console.log("router and factory signed")

}