<script context="module" lang="ts">
	import {
		swapExactInput,
		formatNumber,
		checkAllowanceAndApproveMax
	} from '$lib/scripts/exchange';
	import { addDecimals, removeDecimals } from '$lib/scripts/exchange/utils';
	import type { IExchangeContext } from '$lib/typesFrontend';
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

	export let slippage = 0.01;

	// get context
	const { getRouter, signerObj }: IExchangeContext =
		getContext('exchange');
	const router = getRouter();
	const signer = signerObj.getSigner();
	const signerAddress = signerObj.getAddress();

	export async function callSwap() {
		if (!amount1 || !amount2 || !address1 || !address2) {
			alert('not enough info for swap');
			return;
		}

		if (!route) {
			alert('route not set yet');
			return;
		}

		const amountInExact = addDecimals(amount1, decimals1);
		const amountOutMin = addDecimals(amount2 * (1 - slippage), decimals2);

		let tx = await checkAllowanceAndApproveMax({
			toSpend: amountInExact,
			ownerAddr: signerAddress,
			spenderAddr: router.address,
			tokenAddr: address1,
			signer: signer
		});
		await tx?.wait();

		tx = await swapExactInput({
			amountInExact: amountInExact,
			amountOutMin: amountOutMin,
			route: route,
			to: signerAddress,
			router: router,
			deadline: amountInExact
		}); // TODO change deadline to realistic number
		await tx.wait();
		alert("swap performed")

		// TODO find a way to do this updateBoxAfterSwap();
	}

	async function getSwapTopCurrent() {
		const amountInBig = addDecimals(amount1, decimals1);
		const amountsOut = await router.getAmountsOut(amountInBig, route as string[]);
		const amountOut = amountsOut[amountsOut.length - 1];
		amount2 = formatNumber(removeDecimals(amountOut, decimals2), 6); // if address exists, decimals exist
	}

	async function getSwapBottomCurrent() {
		const amountOutBig = addDecimals(amount2, decimals2);
		const amountsIn = await router.getAmountsIn(amountOutBig, route as string[]);
		const amountIn = amountsIn[0];
		amount1 = formatNumber(removeDecimals(amountIn, decimals1), 6); // if address exists, decimals exist
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
			}
		} else if (e.detail.num === 2) {
			if (address2 && amount2 && address1) {
				getSwapBottomCurrent();
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
	bind:routeCache={route}
/>
