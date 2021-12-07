<script context="module" lang="ts">
	import {
		setAndGetFactoryAndRouterAddress,
		signRouterAndFactory
	} from '$lib/scripts/ConnectContracts';
	import { router, signer, factory, nativeTokenAddress } from '$lib/stores';
	import type { UniswapV2Router02 } from '$lib/typesUsed/UniswapV2Router02';
	import type { UniswapV2Factory } from '$lib/typesUsed/UniswapV2Factory';
	import type { JsonRpcSigner } from '@ethersproject/providers';
	import { performSwap, performLiquidity } from '$lib/scripts/Exchange/ExchangeQueries' ;
	import { NoMetaMaskError } from '$lib/scripts/Exchange/Errors';

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
	import TokenBox from './TokenBox.svelte';
	import { currentInputElement } from './TokenBox.svelte';
	import { page } from '$app/stores';

	let token1Address: string; // address
	let token2Address: string; // address
	let numTokens1: number;
	let numTokens2: number;
	let dollars1 = 0.0;
	let dollars2 = 0.0;
	let balance1: number;
	let balance2: number;
	let route: null | string[];
	let canSwap = false;

	export async function perform() {
		if(!canSwap) {
			alert("Fill in more details | invalid pair")
			return;
		}
		if(!route || !signer_val || !router_val) {
			console.log(route)
			alert("things not existing")
			return;
		}

		if($page.path === '/swap') {
			await performSwap(numTokens1, numTokens2, route, await signer_val.getAddress(), router_val, signer_val, 100)
		} else if($page.path === '/liquidity') {
			await performLiquidity();
		} else {
			alert("This should never happen")
		}

	}

	

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
			// TODO get element by id!
		}
		return false;
	}

	async function handleSelection1(e: any) {
		token1Address = e.detail.address;

		if (!factory_val || !nativeTokenAddr_val || !signer_val) {
			alert('Connect to metamask');
			throw new NoMetaMaskError("Please connect to metamask");
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
			throw new NoMetaMaskError("Please connect to metamask");
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
			dollars1: dollars1_,
			dollars2: dollars2_,
			route: route_,
			numTk1: numTk1_,
			numTk2: numTk2_
		}: {
			dollars1: number | undefined;
			dollars2: number | undefined;
			route: string[] | null;
			numTk1: number | undefined;
			numTk2: number | undefined;
		},
		swapVals: boolean = false
	) {
		canSwap = false;
		route = route_
		if (!swapVals) {
			dollars1 = dollars1_ || dollars1;
			dollars2 = dollars2_ || dollars2;
			numTokens1 = numTk1_ || numTokens1;
			numTokens2 = numTk2_ || numTokens2;
		} else {
			dollars2 = dollars1_ || dollars2;
			dollars1 = dollars2_ || dollars1;
			numTokens2 = numTk1_ || numTokens2;
			numTokens1 = numTk2_ || numTokens1;
		}

		if (route_) {
			canSwap = true;
			
			
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
