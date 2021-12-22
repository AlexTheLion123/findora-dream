<script context="module" lang="ts">
	import {
		formatNumber,
		getAllowance,
		getBalance,
		getDecimals,
		getRoute,
		getSymbol
	} from '$lib/scripts/exchange';
	import { addDecimals, removeDecimals } from '$lib/scripts/exchange/utils';
	import { BigNumber, Contract } from 'ethers';
	import type { IExchangeContext } from '$lib/typesFrontend';
	import type { Ierc20 } from '$lib/typesUsed';
</script>

<script lang="ts">
	import DoubleTokenBox from '../TokenBox/DoubleTokenBox.svelte';
	import { getContext, createEventDispatcher, onMount } from 'svelte';
	import { ERC20ABI } from '$lib/abis';

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
	let allowance1: BigNumber;
	let isCurrentBox1: boolean; // box where input last typed
	let route: string[] | null = null;
	let isApproved: boolean = true;
	const dispatch = createEventDispatcher();

	function getSwapData({
		amountIn,
		amountOutDesired
	}: {
		amountIn: BigNumber;
		amountOutDesired: BigNumber;
	}) {
		if (!address1 || !address2 || !decimals1 || !decimals2 || !route) {
			alert('swap data not set, not enough swap info');
			throw 'not enough swap info';
		}

		return {
			amountIn: amountIn,
			amountOutDesired: amountOutDesired,
			address1: address1,
			address2: address2,
			decimals1: decimals1,
			decimals2: decimals2,
			route: route
		};
	}

	async function getBottomValue() {
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

	async function getTopValue() {
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
		if (!isApproved) {
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
		let status: string;

		if (address1 && address2 && (amount1 || amount2)) {
			const swapData = isCurrentBox1 ? await getBottomValue() : await getTopValue();
			status = getStatus();

			if (status !== 'swap') {
				dispatch('statusUpdate', { status: status });
				return;
			}

			dispatch('statusUpdate', { status: status, swapData: swapData });
			return;
		}

		status = getStatus();

		if (status === 'swap') {
			throw "status is swap when it shouldn't be";
		}

		dispatch('statusUpdate', { status: status });
	}

	function checkApproval1() {
		return addDecimals(amount1, decimals1).lt(allowance1);
	}

	function handleInput1() {
		isApproved = checkApproval1();
		isCurrentBox1 = true;
	}

	function handleInput2() {
		isCurrentBox1 = false;
	}

	async function handleSelection1(e: CustomEvent) {
		balance1 = e.detail.balance;
		decimals1 = e.detail.decimals;
		address1 = e.detail.address;
		symbol1 = e.detail.symbol;
		allowance1 = await getAllowance({
			tokenAddress: address1,
			signer: signer,
			signerAddr: signerAddr,
			spenderAddr: router.address
		});

		if (address2) {
			route = await getRoute({
				addrIn: address1 as string,
				addrOut: address2 as string,
				factory: factory,
				nativeAddr: nativeAddr
			});
		}

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

	}

	function handleInput(e: CustomEvent) {
		e.detail.isBox1 ? handleInput1() : handleInput2();
		handleEvent()
	}

	function handleSelection(e: CustomEvent) {
		e.detail.isBox1 ? handleSelection1(e) : handleSelection2(e);
		handleEvent()
	}

	function listenApproval(_address: string) {
		// could also bind function to parent and don't listen

		const token = new Contract(_address, ERC20ABI, signer) as Ierc20;
		token.on('Approval', () => {
			isApproved = true;
			handleEvent();
		});
	}

	onMount(async () => {
		if (address1) {
			decimals1 = await getDecimals(address1, signer);
			symbol1 = await getSymbol(address1, signer);
			balance1 = removeDecimals(await getBalance(address1, signer, signerAddr), decimals1);
			allowance1 = await getAllowance({
				tokenAddress: address1,
				signer: signer,
				signerAddr: signerAddr,
				spenderAddr: router.address
			});

			listenApproval(address1);
		}
		if (address2) {
			decimals2 = await getDecimals(address2, signer);
		}
		handleEvent();
	});
</script>

<DoubleTokenBox
	bind:amount1
	bind:amount2
	{address1}
	{address2}
	on:input={handleInput}
	on:selection={handleSelection}
/>
