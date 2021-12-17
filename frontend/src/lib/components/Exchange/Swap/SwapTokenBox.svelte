<script context="module" lang="ts">
	import { formatNumber } from '$lib/scripts/exchange';
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
	let route: string[] | null;

	export let swapData: ISwapData;
	export let status: string;

	$: console.log("status: ", status)

	// get context
	const { getRouter }: IExchangeContext = getContext('exchange');
	const router = getRouter();

	function setSwapData({amountIn, amountOutDesired}: {amountIn: BigNumber, amountOutDesired: BigNumber}) {
		if(!address1 || !address2 || !decimals1 || !decimals2 || !route) {
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
			route: route
		}
	}

	// function updateStatus() {
	// 	if(!address1 || !address2) {
	// 		status = "select token"
	// 		return;
	// 	}
	// 	if((address1 && address2 && !amount1) || (address2 && address1 && !amount2)) {
	// 		status = "enter amount"
	// 		return;
	// 	}
	// 	if((address1 && address2 && amount1) || (address2 && address1 && amount2)) {
	// 		status = "swap"
	// 	}	
	// }

	async function getSwapTopCurrent() {
		const amountInBig = addDecimals(amount1, decimals1);
		const amountsOut = await router.getAmountsOut(amountInBig, route as string[]);
		const amountOut = amountsOut[amountsOut.length - 1];
		amount2 = formatNumber(removeDecimals(amountOut, decimals2), 6); // if address exists, decimals exist

		setSwapData({amountIn: amountInBig, amountOutDesired: amountOut})

	}

	async function getSwapBottomCurrent() {
		const amountOutBig = addDecimals(amount2, decimals2);
		const amountsIn = await router.getAmountsIn(amountOutBig, route as string[]);
		const amountIn = amountsIn[0];
		amount1 = formatNumber(removeDecimals(amountIn, decimals1), 6); // if address exists, decimals exist

		setSwapData({amountIn: amountIn, amountOutDesired: amountOutBig})

	}

	/// @dev extra checks are simply sanity checks that should always be true for that event

	function inputWithAddress(e: CustomEvent<any>) {
		if (!route) {
			return;
		}
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
	function selectionWithTokens(e: CustomEvent<any>) {
		if (!route) {
			return;
		}

		console.log("hello");
		
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
	function selectionWithoutTokens(e: CustomEvent<any>) {
		if (!route) {
			return;
		}
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
	bind:routeCache={route}
/>
