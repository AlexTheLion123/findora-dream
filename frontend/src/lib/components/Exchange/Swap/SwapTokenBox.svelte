<script context="module" lang="ts">
	import { checkSufficientAllowance, formatNumber, getRoute } from '$lib/scripts/exchange';
	import { addDecimals, removeDecimals } from '$lib/scripts/exchange/utils';
	import type { IExchangeContext } from '$lib/typesFrontend';
	import type { BigNumber } from 'ethers';
</script>

<script lang="ts">
	import DoubleTokenBox from '../TokenBox/DoubleTokenBox.svelte';
	import { getContext, createEventDispatcher } from 'svelte';

	export let address1: string;
	export let address2: string;

	// get context
	const { getRouter, getFactory, nativeToken, signerObj }: IExchangeContext =
		getContext('exchange');
	const router = getRouter();
	const factory = getFactory();
	const nativeAddr = nativeToken.address;
	const signer = signerObj.getSigner();
	const signerAddr = signerObj.getAddress();

	let amount1: number;
	let amount2: number;
	let decimals1: number;
	let decimals2: number;
	let balance1: number;
	let symbol1: string;
	let currentBox: 1 | 2; // box where input last typed
	let swapData; // TODO type
	let route: string[] | null = null;
	const dispatch = createEventDispatcher();

	function getSwapData({
		amountIn,
		amountOutDesired
	}: {
		amountIn: BigNumber;
		amountOutDesired: BigNumber;
	}) {
		console.log(address1, address2, decimals1, decimals2, route);
		if (!address1 || !address2 || !decimals1 || !decimals2 || !route) {
			alert('swap data not set, not enough swap info');
			throw 'not enough swap info';
		}
		// TODO

		swapData = {
			amountIn: amountIn,
			amountOutDesired: amountOutDesired,
			address1: address1,
			address2: address2,
			decimals1: decimals1,
			decimals2: decimals2,
			route: route
		};
	}

	async function getSwapTop() {
		if (!route) {
			alert('No routecache');
			throw 'No route cache';
		}

		const amountInBig = addDecimals(amount1, decimals1);
		const amountsOut = await router.getAmountsOut(amountInBig, route);
		const amountOut = amountsOut[amountsOut.length - 1];
		amount2 = formatNumber(removeDecimals(amountOut, decimals2), 6); // if address exists, decimals exist

		return getSwapData({ amountIn: amountInBig, amountOutDesired: amountOut });
	}

	async function getSwapBottom() {
		if (!route) {
			alert('No routecache');
			throw 'No route cache';
		}

		const amountOutBig = addDecimals(amount2, decimals2);
		const amountsIn = await router.getAmountsIn(amountOutBig, route);
		const amountIn = amountsIn[0];
		amount1 = formatNumber(removeDecimals(amountIn, decimals1), 6); // if address exists, decimals exist

		return getSwapData({ amountIn: amountIn, amountOutDesired: amountOutBig });
	}

	function getStatus() {
		if (
			!checkSufficientAllowance({
				ownerAddr: signerAddr,
				spenderAddr: router.address,
				tokenAddr: address1,
				signer: signer
			})
		) {
			return `approve ${symbol1}`;
		}

		if (!address2) {
			return 'select token';
		}

		if (!amount1) {
			return 'enter amount';
		}

		if (amount1 > balance1) {
			return `insufficient ${symbol1}`;
		}

		return 'swap';

		// TODO catch too much amount2
	}

	async function handleEvent() {
		let status = getStatus();

		if (address1 && address2 && (amount1 || amount2)) {
			swapData = currentBox === 1 ? await getSwapTop() : await getSwapBottom();
			status = getStatus();

			if (status !== 'swap') {
				dispatch('statusUpdate', { status: status });
				console.log('not ready to swap yet');
				return;
			}

			dispatch('statusUpdate', { status: status, swapData: swapData });
			return;
		}

		if (status === 'swap') {
			throw "status is swap when it shouldn't be";
		}

		dispatch('statusUpdate', { status: status });
	}

	function handleInput1() {
		currentBox = 1;

		handleEvent();
	}

	function handleInput2() {
		currentBox = 2;
		handleEvent();
	}

	async function handleSelection1(e: CustomEvent) {
		balance1 = e.detail.balance;
		decimals1 = e.detail.decimals;
		address1 = e.detail.address;
		symbol1 = e.detail.symbol;

		if (address2) {
			route = await getRoute({
				addrIn: address1 as string,
				addrOut: address2 as string,
				factory: factory,
				nativeAddr: nativeAddr
			});
		}

		handleEvent();
	}

	async function handleSelection2(e: CustomEvent) {
		decimals2 = e.detail.decimals;
		address2 = e.detail.address;

		if (address1) {
			route = await getRoute({
				addrIn: address1 as string,
				addrOut: address2 as string,
				factory: factory,
				nativeAddr: nativeAddr
			});
		}

		handleEvent();
	}

	function handleInput(e: CustomEvent) {
		e.detail.tokenBox === 1 ? handleInput1() : handleInput2();
	}

	function handleSelection(e: CustomEvent) {
		e.detail.tokenBox === 1 ? handleSelection1(e) : handleSelection2(e);
	}
</script>

<DoubleTokenBox
	bind:amount1
	bind:amount2
	{address1}
	{address2}
	on:input={handleInput}
	on:selection={handleSelection}
/>
