import { writable} from 'svelte/store'
import type { Web3Provider, JsonRpcSigner } from '@ethersproject/providers';
import type { UniswapV2Router02} from '$lib/typesUsed/UniswapV2Router02';
import type { UniswapV2Factory} from '$lib/typesUsed/UniswapV2Factory'

// metamask
export const isConnected = writable(false);
export const currentAccount = writable<null | string>(null);
export const chainId = writable<null | string>(null)


// connect button
export const buttonText = writable("Connect Wallet");

// ethers
export const provider  = writable<null | Web3Provider>(null)  
export const signer = writable<null | JsonRpcSigner>(null)  
export const isProvided = writable(false);

// Exchange
export const FACTORY_ADDRESS = writable<null | string>(null)
export const ROUTER_ADDRESS = writable<null | string>(null)
export const router = writable<null | UniswapV2Router02>(null)
export const factory = writable<null | UniswapV2Factory>(null)
export const nativeTokenAddress = writable<null | string>(null)

// grid or list layout, can probably handle some other way
export const isGrid = writable(false);





