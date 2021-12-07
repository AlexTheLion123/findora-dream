<script context="module" lang="ts">
	import {
		setAndGetFactoryAndRouterAddress,
		signRouterAndFactory
	} from '$lib/scripts/ConnectContracts';
	import { router, signer, factory, nativeTokenAddress } from '$lib/stores';
	import type { UniswapV2Router02 } from '$lib/typesUsed/UniswapV2Router02';
	import type { UniswapV2Factory } from '$lib/typesUsed/UniswapV2Factory';
	import type { JsonRpcSigner } from '@ethersproject/providers';

	// NOTE contracts are signed in a module context in the relevant components that use them.
	// This can be changed to sign all contracts at once upon load asynchronously
	// native token address is set in TokenSearchDialog in module context

	// do not require provider to do this
	const { factory_address, router_address } = setAndGetFactoryAndRouterAddress();

	// once signer available then we can sign router contract store
	let signer_val: null | JsonRpcSigner;
	signer.subscribe((value) => {
		if (value) {
			signer_val = value;
			// isProvided = true, then sign the router contract.
			// DoubleTokenBox signs the router contract in module context since it is used in both the swap and liquidity components
			signRouterAndFactory(router, factory, router_address, factory_address, value);
		}
	});
	// TODO stop using separate signer variable, just get signer from factory!

	let router_val: null | UniswapV2Router02; // TODO remove
	let factory_val: null | UniswapV2Factory;
	let nativeTokenAddr_val: null | string;
	router.subscribe((value) => (router_val = value));
	factory.subscribe((value) => (factory_val = value));
	nativeTokenAddress.subscribe((value) => (nativeTokenAddr_val = value));
</script>

<script lang="ts">
	import { handleSelectionGeneric, handleInputGeneric } from '$lib/scripts/Exchange/Events';
	import type { ICallbackReturn } from '$lib/typesFrontend/Types';
	import TokenBox from './TokenBox.svelte';
	import { currentInputElement } from './TokenBox.svelte';

	let token1Address: string; // address
	let token2Address: string; // address
	let numTokens1: number;
	let numTokens2: number;
	let dollars1 = 0.0;
	let dollars2 = 0.0;
	let balance1: number;
	let balance2: number;

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
				element!.parentElement!.parentElement!.parentElement!.parentElement!.parentElement
			); // TODO find better way to do this
		}
		return false;
	}

	async function handleSelection1(e: any) {
		token1Address = e.detail.address;

		if (!factory_val || !nativeTokenAddr_val || !signer_val) {
			// TODO throw proper error
			alert('Connect to metamask');
			return;
		}

		assignToGlobalVars(
			await handleSelectionGeneric(
				numTokens1,
				numTokens2,
				token1Address,
				token2Address,
				checkCurrent(e.detail.element),
				factory_val,
				nativeTokenAddr_val,
				signer_val
			),
			false
		);
	}

	async function handleSelection2(e: any) {
		token2Address = e.detail.address;

		if (!factory_val || !nativeTokenAddr_val || !signer_val) {
			alert('Connect to metmask');
			return;
		}

		assignToGlobalVars(
			await handleSelectionGeneric(
				numTokens2,
				numTokens1,
				token2Address,
				token1Address,
				checkCurrent(e.detail.element),
				factory_val,
				nativeTokenAddr_val,
				signer_val
			),
			true
		);
	}

	async function handleInput1(e: any) {
		numTokens1 = e.detail.numTokens;

		if (!factory_val || !nativeTokenAddr_val || !signer_val) {
			alert('Connect to metamask');
			return;
		}

		assignToGlobalVars(
			await handleInputGeneric(
				numTokens1,
				token1Address,
				token2Address,
				factory_val,
				nativeTokenAddr_val,
				signer_val
			),
			false
		);
	}

	async function handleInput2(e: any) {
		numTokens2 = e.detail.numTokens;

		if (!factory_val || !nativeTokenAddr_val || !signer_val) {
			alert('Connect to metamask');
			return;
		}

		assignToGlobalVars(
			await handleInputGeneric(
				numTokens2,
				token2Address,
				token1Address,
				factory_val,
				nativeTokenAddr_val,
				signer_val
			),
			true
		);
	}

	function assignToGlobalVars(
		{
			dollars1: dollars1P,
			dollars2: dollars2P,
			route,
			numTk1: numTk1P,
			numTk2: numTk2P
		}: {
			dollars1: number | undefined;
			dollars2: number | undefined;
			route: string[] | null;
			numTk1: number | undefined;
			numTk2: number | undefined;
		},
		swapVals: boolean = false
	) {
		if (!swapVals) {
			dollars1 = dollars1P || dollars1;
			dollars2 = dollars2P || dollars2;
			numTokens1 = numTk1P || numTokens1;
			numTokens2 = numTk2P || numTokens2;
		} else {
			dollars2 = dollars1P || dollars2;
			dollars1 = dollars2P || dollars1;
			numTokens2 = numTk1P || numTokens2;
			numTokens1 = numTk2P || numTokens1;
		}

		if (route) {
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
		bind:balance={balance1}
	/>
</div>

<div class="token-box">
	<TokenBox
		on:tokenSelected={handleSelection2}
		on:tokenNumInput={handleInput2}
		dollars={dollars2}
		numTokens={numTokens2}
		bind:balance={balance2}
	/>
</div>

<style>
</style>
