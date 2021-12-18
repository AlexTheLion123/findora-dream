<script context="module" lang="ts">
	import { Contract } from 'ethers';
	import { UniswapV2PairABI } from '$lib/abis';
	import {
		addDecimals,
		getPosition,
		checkAllowanceAndApproveMax
	} from '$lib/scripts/exchange';
	import type { UniswapV2Pair } from '$lib/typesUsed';
	import type { IExchangeContext } from '$lib/typesFrontend';
</script>

<script lang="ts">
	import TokenBox from '$lib/components/Exchange/TokenBox/TokenBox.svelte';
	import TradeButton from '$lib/components/Misc/TradeButton.svelte';
	import RangeSlider from 'svelte-range-slider-pips';
	import { getContext } from 'svelte';
	import ReceiveInfo from '$lib/components/Exchange/Liquidity/RemoveLiquidity/ReceiveInfo.svelte';

	const { signerObj, getRouter, getFactory }: IExchangeContext = getContext('exchange');
	const signer = signerObj.getSigner();
	const signerAddr = signerObj.getAddress();
	const router = getRouter();
	const factory = getFactory();

	export let slippage = 0.01;
	export let pairAddress: string;

	// pair
	$: amount = (sliderVal / 100) * balance;
	let decimals: number;
	let balance: number;

	let address1: string;
	let symbol1: string;
	let decimals1: number;
	let balance1: number;
	$: amount1 = (sliderVal / 100) * balance1;

	let address2: string;
	let symbol2: string;
	let balance2: number;
	let decimals2: number;
	$: amount2 = (sliderVal / 100) * balance2;

	let symbol = '';
	let state = 'Enter amount';
	let disabled = true;

	let values = [0]; // slider
	$: sliderVal = values[0];

	const init = initialize();

	$: if (!amount) {
		disabled = true;
		state = 'Enter amount';
	} else {
		disabled = false;
		state = 'Remove liquidity';
	}

	async function initialize() {
		const tokenInstance = new Contract(pairAddress, UniswapV2PairABI, signer) as UniswapV2Pair;
		address1 = await tokenInstance.token0(); // TODO improve efficiency
		address2 = await tokenInstance.token1();

		try {
			const { pair, tokenA, tokenB } = await getPosition({
				addr1: address1,
				addr2: address2,
				factoryAddr: factory.address,
				signer: signer,
				signerAddr: signerAddr
		});

			symbol = pair.symbol;
			decimals = pair.decimals;
			balance = pair.balance;

			balance1 = tokenA.balance;
			symbol1 = tokenA.symbol;
			decimals1 = tokenA.decimals;

			balance2 = tokenB.balance;
			symbol2 = tokenB.symbol;
			decimals2 = tokenB.decimals;
		} catch (error) {}
	}

	async function callRemove() {
		if (!amount || !pairAddress || !decimals || !address1 || !address2 || !amount1 || !amount2) {
			alert('not enought info');
			throw 'not enough info';
		}

		console.log('to remove liquidity');
		const amountToRemove = addDecimals(amount, decimals);
		const amountAMin = addDecimals(amount1 * (1 - slippage), decimals1);
		const amountBMin = addDecimals(amount2 * (1 - slippage), decimals2);

		let tx = await checkAllowanceAndApproveMax({
			toSpend: amountToRemove,
			ownerAddr: signerAddr,
			spenderAddr: router.address,
			tokenAddr: pairAddress,
			signer: signer
		});
		await tx?.wait();

		tx = await router.removeLiquidity(
			address1,
			address2,
			amountToRemove,
			amountAMin,
			amountBMin,
			signerAddr,
			amountAMin
		);
		await tx.wait();
		console.log('remove liquidity successful');
	}
</script>

{#await init then}
	<TokenBox editable={false} bind:numTokens={amount} address={pairAddress} {symbol} />
{:catch error}
	<p>Invalid address</p>
	{console.log(error)}
{/await}
<div class="slider">
	<RangeSlider id="color-pips" range="min" float pips step={5} bind:values />
</div>
{#if amount1 && amount2}
	<ReceiveInfo {amount1} {amount2} {symbol1} {symbol2} />
{/if}
<div class="button">
	<TradeButton text={state} on:click={callRemove} {disabled} />
</div>

<style>
	.slider {
		margin: 50px 0;
	}
</style>
