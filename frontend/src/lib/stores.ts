import { writable} from 'svelte/store'
import type { Web3Provider, JsonRpcSigner } from '@ethersproject/providers';
import type { UniswapV2Factory, UniswapV2Router02 } from '$lib/typesUsed';

// metamask
export const isConnected = writable(false);
export const currentAccount = writable<null | string>(null);
export const chainId = writable<null | string>(null)

// connect button
export const buttonText = writable("Connect Wallet");

// ethers (global)
export const provider  = writable<null | Web3Provider>(null)  
export const signer = writable<null | JsonRpcSigner>(null)
export const signerAddress = writable<null | string>(null)  
export const isProvided = writable(false);
export const nativeTokenAddress = writable<null | string>(null)

// exchange
export const factory = writable<null | UniswapV2Factory>(null)
export const router = writable<null | UniswapV2Router02>(null)

// grid or list layout, can probably handle some other way, yeah in context my boi
export const isGrid = writable(false);





