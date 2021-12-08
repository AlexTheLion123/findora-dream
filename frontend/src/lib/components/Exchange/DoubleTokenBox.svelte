<script context="module" lang="ts">
	import {
		setAndGetFactoryAndRouterAddress,
		signRouterAndFactory
	} from '$lib/scripts/ConnectContracts';
	import { router, signer, factory, nativeTokenAddress } from '$lib/stores';
	import type { UniswapV2Router02 } from '$lib/typesUsed/UniswapV2Router02';
	import type { UniswapV2Factory } from '$lib/typesUsed/UniswapV2Factory';
	import type { JsonRpcSigner } from '@ethersproject/providers';
	import {
		performSwap,
		performLiquidity,
		getDollarValue,
	} from '$lib/scripts/Exchange/ExchangeQueries';
	import { NoMetaMaskError } from '$lib/scripts/Exchange/Errors';
	import { getBalance } from '$lib/scripts/Exchange/ExchangeQueries';

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
	import TokenBox from './TokenBox.svelte';
	// import { currentInputElement } from './TokenBox.svelte';
	import { page } from '$app/stores';
	import { getExactSwapData } from '$lib/scripts/Exchange/ExchangeUtils';
	import { respond } from '@sveltejs/kit/ssr';
import { tick } from 'svelte';

	let tokenBox1: TokenBox;
	let tokenBox2: TokenBox;
	let canSwapLock = false;
	let swapData: ISwapData;
	let currentTokenBox: TokenBox | undefined;
	let otherTokenBox: TokenBox | undefined;

	interface ISwapData {
		route: string[];
		numOutput: number;
		dollarOutput: number;
	}

	export async function perform() {

		if (!canSwapLock) {
			alert('Fill in more details | invalid pair');
			return;
		}
	
		if(!currentTokenBox || !otherTokenBox || !currentTokenBox.numTokens || !otherTokenBox.numTokens || !signer_val || !router_val) throw "undefined values before swap, should never happen";

		if ($page.path === '/swap') {
			await performSwap(
				currentTokenBox.numTokens,
				otherTokenBox.numTokens * 0.95,
				swapData.route,
				await signer_val.getAddress(),
				router_val,
				signer_val,
				100
			);
		} else if ($page.path === '/liquidity') {
			await performLiquidity();
		} else {
			alert('This should never happen');
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

	/**
	 * @dev there are 3 scenarios to handle
	 * e contains the selected token box
	 */
	// TODO just use current and non-current

	async function handleSelectionGeneric(_tokenBox: TokenBox, e: any) {
		canSwapLock = false;
		_tokenBox.address = e.detail.address;

		if (!_tokenBox.address) throw 'address does not exist for selection, this should never happen';

		// TODO move to validation function, although typescript didn't enjoy that, try without parameters and use global variables
		if (!factory_val || !nativeTokenAddr_val || !signer_val) {
			alert('Connect to metamask');
			throw new NoMetaMaskError('Please connect to metamask');
		}

		getBalance(_tokenBox.address, signer_val)
			.then((res) => {
				_tokenBox.balance = res;
			})
			.catch(alert);

		if (currentTokenBox === _tokenBox) {
			// Scenario 1 and 2

			// can't swap yet, can only get dollar value
			if (!_tokenBox.numTokens) throw 'this should never happen';
			getDollarValue(_tokenBox.address, _tokenBox.numTokens)
				.then((res) => {
					_tokenBox.dollars = res;
				})
				.catch(alert);

			if (otherTokenBox && otherTokenBox.address) {
				// otherTokenBox has also been selected, so we can get its corresponding output tokens

				// _tokenBox is the input
				await getSwapData(_tokenBox).then(setSwapData).catch(alert);
			}
		} else if (currentTokenBox && otherTokenBox) {
			// if not current, but current exists, can't get dollar value here since no input since not current

			if (currentTokenBox.address) {
				getRates();

				if (currentTokenBox.numTokens) {
					// otherTokenBox is the input
					await getSwapData(currentTokenBox).then(setSwapData).catch(alert);
				}
			}
		} else {
			// currentTokenBox does not exist yet
			if (otherTokenBox && otherTokenBox.address) {
				console.log(currentTokenBox && otherTokenBox)
				getRates();
			}
		}
	}

	async function handleInputGeneric(_tokenBox: TokenBox, e: any) {
		updateCurrentTokenBox(_tokenBox);
		_tokenBox.numTokens = e.detail.numTokens;
		if (!_tokenBox.numTokens) throw 'that value does not exist, this should never happen';

		if (!factory_val || !nativeTokenAddr_val || !signer_val) {
			alert('Connect to metamask');
			return;
		}

		if (_tokenBox.address) {
			getDollarValue(_tokenBox.address, _tokenBox.numTokens)
				.then((res) => (_tokenBox.dollars = res))
				.catch(alert);

			if (otherTokenBox && otherTokenBox.address) {
				// _tokenBox is input
				await getSwapData(_tokenBox).then(setSwapData).catch(alert);
			}
		}
	}

	/**
	 * @param _tokenBox In this case, _tokenBox should always just be the current token box
	 */
	function getSwapData(_tokenBox: TokenBox) {
		if(_tokenBox !== currentTokenBox) throw "not current box, should never happen"  


		if (!otherTokenBox || !currentTokenBox.address || !otherTokenBox.address || !currentTokenBox.numTokens)
			throw "some required values haven't been provided, this should never happen";

		// TODO move to validation function, although typescript didn't enjoy that, try without parameters and use global variables
		if (!factory_val || !nativeTokenAddr_val || !signer_val) {
			alert('Connect to metamask');
			throw new NoMetaMaskError('Please connect to metamask');
		}
		
		return getExactSwapData(
			currentTokenBox.address,
			otherTokenBox.address,
			currentTokenBox.numTokens,
			factory_val,
			nativeTokenAddr_val,
			signer_val
		).then((res) => {
			if(!otherTokenBox) throw "other box does not exist, should never happen"

			otherTokenBox.numTokens = res.numOutput;
			otherTokenBox.dollars = res.dollarOutput;

			return {
				route: res.route,
				numOutput: res.numOutput,
				dollarOutput: res.dollarOutput
			};
		});
	}

	function updateCurrentTokenBox(_tokenBox: TokenBox) {
		if (_tokenBox === tokenBox1) {
			currentTokenBox = tokenBox1;
			otherTokenBox = tokenBox2;
		} else {
			currentTokenBox = tokenBox2;
			otherTokenBox = tokenBox1;
		}
	}

	/**
	 * @dev just gets the swap rate and dollar rates for the tokens, also caches
	 */
	function getRates() {
		console.log('implement get rates');
	}

	function setSwapData({ route, numOutput, dollarOutput }: ISwapData) {
		canSwapLock = true;

		swapData = {
			route: route,
			numOutput: numOutput,
			dollarOutput: dollarOutput
		};
	}
</script>

<div class="token-box">
	<TokenBox
		bind:this={tokenBox1}
		on:tokenSelected={(e) => handleSelectionGeneric(tokenBox1, e)}
		on:tokenNumInput={(e) => handleInputGeneric(tokenBox1, e)}
	/>
</div>

<div class="token-box">
	<TokenBox
		bind:this={tokenBox2}
		on:tokenSelected={(e) => handleSelectionGeneric(tokenBox2, e)}
		on:tokenNumInput={(e) => handleInputGeneric(tokenBox2, e)}
	/>
</div>

<style>
</style>
