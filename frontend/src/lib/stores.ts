import { writable} from 'svelte/store'
import type { Web3Provider, JsonRpcSigner } from '@ethersproject/providers';
import type { UniswapV2Router02} from '$lib/typesUsed/UniswapV2Router02';
import type { UniswapV2Factory} from '$lib/typesUsed/UniswapV2Factory'

// metamask
export const isConnected = writable(false);
export const currentAccount = writable(null);
export const chainId = writable(null);

// connect button
export const buttonText = writable("Connect Wallet");

// ethers
export const provider  = writable(null as Web3Provider) 
export const signer = writable(null as JsonRpcSigner) 
export const isProvided = writable(false);

// Exchange
export const FACTORY_ADDRESS = writable(null as string)
export const ROUTER_ADDRESS = writable(null as string)
export const router = writable(null as UniswapV2Router02);
export const factory = writable(null as UniswapV2Factory)
export const nativeTokenAddress = writable(null as string);

// grid or list layout, can probably handle some other way
export const isGrid = writable(false);

