<script context="module" lang="ts">
	import { formatNumber, getRoute } from '$lib/scripts/exchange';
	import { addDecimals, removeDecimals } from '$lib/scripts/exchange/utils';
	import type { IExchangeContext, ISwapData } from '$lib/typesFrontend';
	import type {BigNumber} from 'ethers'
</script>

<script lang="ts">
	import DoubleTokenBox from '../TokenBox/DoubleTokenBox.svelte';
	import { getContext } from 'svelte';

	let amount1: number;
	let amount2: number;
	let address1: string;
	let address2: string;
	let decimals1: number;
	let decimals2: number;
	
	export let symbol1: string; // TODO implement address page param for swap as well
	export let symbol2: string;
	export let logo1: string;
	export let logo2: string;

	export let swapData: ISwapData;
	export let status: string;
    let routeCache: string[] | null = null;

	// get context
	const { getRouter, getFactory, nativeToken }: IExchangeContext = getContext('exchange');
	const router = getRouter();
	const factory = getFactory();
	const nativeAddr = nativeToken.address;

	function setSwapData({amountIn, amountOutDesired}: {amountIn: BigNumber, amountOutDesired: BigNumber}) {
		if(!address1 || !address2 || !decimals1 || !decimals2 || !routeCache) {
			alert("swap data not set, not enough swap info")
			throw "not enough swap info"
		}

		swapData = {
			amountIn: amountIn,
			amountOutDesired: amountOutDesired,
			address1: address1,
			address2: address2,
			decimals1: decimals1,
			decimals2: decimals2,
			route: routeCache
		}
	}

	async function getRouteIfCache() {
		if (!address1 || !address2) {
			return null;
		}

		if (!routeCache) {
			try{
				return await getRoute({
					addrIn: address1 as string,
					addrOut: address2 as string,
					factory: factory,
					nativeAddr: nativeAddr
				});

			} catch(e) {
				throw "No route error"
			}
		} else {
			return routeCache;
		}
	}

	async function getSwapTopCurrent() {
		if(!routeCache) {
			alert("No routecache")
			throw "No route cache"
		}

		const amountInBig = addDecimals(amount1, decimals1);
		const amountsOut = await router.getAmountsOut(amountInBig, routeCache);
		const amountOut = amountsOut[amountsOut.length - 1];
		amount2 = formatNumber(removeDecimals(amountOut, decimals2), 6); // if address exists, decimals exist

		setSwapData({amountIn: amountInBig, amountOutDesired: amountOut})

	}

	async function getSwapBottomCurrent() {
		if(!routeCache) {
			alert("No routecache")
			throw "No route cache"
		}

		const amountOutBig = addDecimals(amount2, decimals2);
		const amountsIn = await router.getAmountsIn(amountOutBig, routeCache);
		const amountIn = amountsIn[0];
		amount1 = formatNumber(removeDecimals(amountIn, decimals1), 6); // if address exists, decimals exist

		setSwapData({amountIn: amountIn, amountOutDesired: amountOutBig})

	}

	/// @dev extra checks are simply sanity checks that should always be true for that event

	async function inputWithAddress(e: CustomEvent<any>) {
		routeCache = await getRouteIfCache();


		if (e.detail.num === 1) {
			if (address2 && address1 && amount1) {
				getSwapTopCurrent();
			}
		} else {
			if (address1 && address2 && amount2) {
				getSwapBottomCurrent();
			}
		}
	}
	async function selectionWithTokens(e: CustomEvent<any>) {
		routeCache = null;
        routeCache = await getRouteIfCache();
		
		if (e.detail.num === 1) {
			
			if (amount2 && amount1 && address1) {
				getSwapTopCurrent();
			} 
		} else {
			if (address1 && amount2 && address2) {
				getSwapBottomCurrent();
			} 
		}
	}
	async function selectionWithoutTokens(e: CustomEvent<any>) {
		routeCache = null;
        routeCache = await getRouteIfCache();

		if (e.detail.num === 1) {
			if (address1 && amount1 && address2) {
				getSwapTopCurrent();
			} else {
				status = (address1 && address2) ? "enter amount" : "select token"
			}
		} else if (e.detail.num === 2) {
			if (address2 && amount2 && address1) {
				getSwapBottomCurrent();
			}else {
				status = (address1 && address2) ? "enter amount" : "select token"
			}
		}
	}
</script>

<DoubleTokenBox
	on:inputWithAddress={inputWithAddress}
	on:selectionWithTokens={selectionWithTokens}
	on:selectionWithoutTokens={selectionWithoutTokens}
	bind:amount1
	bind:amount2
	bind:decimals1
	bind:decimals2
	bind:address1
	bind:address2
	bind:status
	bind:symbol1
	bind:symbol2
	{logo1}
	{logo2}
/>
