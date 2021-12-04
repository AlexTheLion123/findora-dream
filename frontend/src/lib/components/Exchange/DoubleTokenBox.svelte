<script lang="ts">
	import { handleSelectionGeneric, handleInputGeneric } from '$lib/scripts/Exchange/Events';
	import type { Address } from 'soltypes';
	import TokenBox from './TokenBox.svelte';

	let token1Address: Address; // address
	let token2Address: Address; // address
	let numTokens1: number;
	let numTokens2: number;
	let dollars1 = 0.0;
	let dollars2 = 0.0;

	/**
	 * Event handlers
	 * There are four events:
	 * 1. Token 1 selected
	 * 2. Token 2 selected
	 * 3. Token 1 input
	 * 4. Token 2 input
	 *
	 */

	async function handleSelection1(e) {
		token1Address = e.detail.address;
		console.log(token1Address);

		globalGenericEventHandler(
			numTokens1,
			token1Address,
			numTokens2,
			token2Address,
			dollars1,
			dollars2,
			false
		);
	}

	/**
	 * @dev function to generically handle both selection cases
	 * trailing P stands for parameter, trailing R stands for return value
	 */

	async function handleSelection2(e) {
		token2Address = e.detail.address;
		console.log(token2Address);

		globalGenericEventHandler(
			numTokens2,
			token2Address,
			numTokens1,
			token1Address,
			dollars2,
			dollars1,
			true
		);
	}

	async function handleInput1(e) {
		numTokens1 = e.detail.numTokens;
		console.log(numTokens1);

		globalGenericEventHandler(
			numTokens1,
			token1Address,
			numTokens2,
			token2Address,
			dollars1,
			dollars2,
			false
		);
	}

	async function handleInput2(e) {
		numTokens2 = e.detail.numTokens;
		console.log(numTokens2);

		globalGenericEventHandler(
			numTokens2,
			token2Address,
			numTokens1,
			token1Address,
			dollars2,
			dollars1,
			true
		);
	}

	async function globalGenericEventHandler(
		numTokens1P: number,
		token1AddressP: Address,
		numTokens2P: number,
		token2AddressP: Address,
		dollars1P: number,
		dollars2P: number,
		swapVals: boolean
	) {
		const { dollars1R, dollars2R, routeR, numTk1R, numTk2R } = await handleInputGeneric(
			numTokens1P,
			token1AddressP,
			numTokens2P,
			token2AddressP,
			dollars1P,
			dollars2P
		);
		assignToGlobalVars({ dollars1R, dollars2R, routeR, numTk1R, numTk2R }, swapVals);
	}

	function assignToGlobalVars(
		{ dollars1R, dollars2R, routeR, numTk1R, numTk2R }: IDoubleBox,
		swapVals: boolean = false
	) {
		if (!swapVals) {
			if (dollars1R) dollars1 = dollars1R;
			if (dollars2R) dollars2 = dollars2R;
			if (numTk1R) numTokens1 = numTk1R;
			if (numTk1R) numTokens2 = numTk2R;
		} else {
			if (dollars1R) dollars2 = dollars1R;
			if (dollars2R) dollars1 = dollars2R;
			if (numTk1R) numTokens2 = numTk1R;
			if (numTk1R) numTokens1 = numTk2R;
		}

		if (routeR) {
			// swap is ready to be performed
		}
	}
	interface IDoubleBox {
		dollars1R: number;
		dollars2R: number;
		routeR: Array<Address>;
		numTk1R: number;
		numTk2R: number;
	}
</script>

<div class="token-box">
	<TokenBox
		on:tokenSelected={handleSelection1}
		on:tokenNumInput={handleInput1}
		dollars={dollars1}
		numTokens={numTokens1}
	/>
</div>

<div class="token-box">
	<TokenBox
		on:tokenSelected={handleSelection2}
		on:tokenNumInput={handleInput2}
		dollars={dollars2}
		numTokens={numTokens2}
	/>
</div>

<style>
</style>
