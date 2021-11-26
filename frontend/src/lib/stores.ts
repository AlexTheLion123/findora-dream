import { writable } from 'svelte/store'

// metamask
export const isConnected = writable(false);
export const currentAccount = writable(null);
export const chainId = writable(null);

// grid or list layout
export const isGrid = writable(false);
