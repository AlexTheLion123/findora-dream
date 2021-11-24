import { writable } from 'svelte/store'

export const isConnected = writable(false);
export const currentAccount = writable(null);
export const chainId = writable(null);
