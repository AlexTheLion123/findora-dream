import { writable} from 'svelte/store'
import type { Web3Provider, JsonRpcSigner } from '@ethersproject/providers';
import type { UniswapV2Router02} from '$lib/typesUsed/UniswapV2Router02';


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
export const router = writable(null as UniswapV2Router02);

// grid or list layout
export const isGrid = writable(false);

