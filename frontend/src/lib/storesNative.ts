import { nativeTokenAddress, factory } from "./stores";
import type { UniswapV2Factory } from "./typesUsed/UniswapV2Factory";
/**
 * So that you only have to subscribe to store once
 * When using store in another js/ts file, simply import store val from here instead of subscribing everywher
 */

export let nativeTokenAddr_val: null|string;
export let factory_val: null | UniswapV2Factory

nativeTokenAddress.subscribe(value => nativeTokenAddr_val = value)
factory.subscribe(value => factory_val = value)