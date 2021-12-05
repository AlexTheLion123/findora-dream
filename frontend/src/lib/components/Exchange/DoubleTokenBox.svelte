<script context="module" lang="ts">
	import { setFactoryAndRouterAddress, signRouterAndFactory} from '$lib/scripts/ConnectContracts'
	import { signer } from '$lib/stores'

	// NOTE contracts are signed in a module context in the relevant components that use them.
	// This can be changed to sign all contracts at once upon load asynchronously

	// do not require provider to do this
	setFactoryAndRouterAddress();

	// once signer available then we can sign router contract store
	signer.subscribe((value) => {
		if (value) {
			// isProvided = true, then sign the router contract.
			// DoubleTokenBox signs the router contract in module context since it is used in both the swap and liquidity components
			signRouterAndFactory();
		}
	});
</script>

<script lang="ts">
	import { handleSelectionGeneric, handleInputGeneric } from '$lib/scripts/Exchange/Events';
	import type { Address } from 'soltypes';
	import type { ICallbackReturn } from '$lib/typesFrontend/Types';
	import TokenBox from './TokenBox.svelte';
	import { currentInputElement } from './TokenBox.svelte';

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

	function checkCurrent(element: HTMLElement) {
		if (currentInputElement) {
			return (
				currentInputElement.parentElement ===
				element.parentElement.parentElement.parentElement.parentElement.parentElement
			); // TODO find better way to do this
		}
		return false;
	}

	async function handleSelection1(e) {
		token1Address = e.detail.address;
		assignToGlobalVars(
			await handleSelectionGeneric(
				numTokens1,
				numTokens2,
				token1Address,
				token2Address,
				checkCurrent(e.detail.element)
			),
			false
		);
	}

	async function handleSelection2(e) {
		token2Address = e.detail.address;
		assignToGlobalVars(
			await handleSelectionGeneric(
				numTokens2,
				numTokens1,
				token2Address,
				token1Address,
				checkCurrent(e.detail.element)
			),
			true
		);
	}

	async function handleInput1(e) {
		numTokens1 = e.detail.numTokens;
		assignToGlobalVars(await handleInputGeneric(numTokens1, token1Address, token2Address), false);
	}

	async function handleInput2(e) {
		numTokens2 = e.detail.numTokens;
		assignToGlobalVars(await handleInputGeneric(numTokens2, token2Address, token1Address), true);
	}

	function assignToGlobalVars(
		{ dollars1R, dollars2R, routeR, numTk1R, numTk2R }: ICallbackReturn,
		swapVals: boolean = false
	) {
		if (!swapVals) {
			dollars1 = dollars1R || dollars1;
			dollars2 = dollars2R || dollars2;
			numTokens1 = numTk1R || numTokens1;
			numTokens2 = numTk2R || numTokens2;
		} else {
			dollars2 = dollars1R || dollars2;
			dollars1 = dollars2R || dollars1;
			numTokens2 = numTk1R || numTokens2;
			numTokens1 = numTk2R || numTokens1;
		}

		if (routeR) {
			// swap is ready to be performed
			console.log('swap is ready');
		}
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
