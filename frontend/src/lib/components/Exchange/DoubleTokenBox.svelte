<script context="module" lang="ts">
	import type { UniswapV2Router02, UniswapV2Factory } from '$lib/typesUsed';
	import type { JsonRpcSigner } from '@ethersproject/providers';

	import {
		performSwap,
		performLiquidity,
		getDollarValue,
		approveMax,
		NoMetaMaskError,
		getBalance,
		getPairAddress,
		getExactSwapData
	} from '$lib/scripts/exchange';
</script>

<script lang="ts">
	import TokenBox from './TokenBox.svelte';
	// import { currentInputElement } from './TokenBox.svelte';
	import { page } from '$app/stores';
	import { factory, router } from '$lib/stores';

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
		pairAddress: string;
		sufficientAllowance: boolean;
	}

	export async function perform() {
		if (!canSwapLock) {
			alert('Fill in more details | invalid pair');
			return;
		}

		if (
			!currentTokenBox ||
			!otherTokenBox ||
			!currentTokenBox.numTokens ||
			!otherTokenBox.numTokens ||
			!$factory ||
			!$router
		) {
			throw 'undefined values before swap, should never happen';
		}

		if (!swapData.sufficientAllowance) {
			alert('approving token first');
			await approveMax(swapData.route[0], $router.address, $router.signer).catch((e) =>
				console.log('approving the maximum amount failed', e)
			);
		}

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
			alert('Invalid pageThis should never happen');
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
				console.log(currentTokenBox && otherTokenBox);
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
		if (_tokenBox !== currentTokenBox) throw 'not current box, should never happen';

		if (
			!otherTokenBox ||
			!currentTokenBox.address ||
			!otherTokenBox.address ||
			!currentTokenBox.numTokens
		)
			throw "some required values haven't been provided, this should never happen";

		// TODO move to validation function, although typescript didn't enjoy that, try without parameters and use global variables
		if (!factory_val || !nativeTokenAddr_val || !signer_val || !router_val || !router_val.address) {
			alert('Connect to metamask');
			throw new NoMetaMaskError('Please connect to metamask');
		}

		return getExactSwapData(
			currentTokenBox.address,
			otherTokenBox.address,
			currentTokenBox.numTokens,
			factory_val,
			nativeTokenAddr_val,
			signer_val,
			router_val.address
		).then((res) => {
			if (!otherTokenBox) throw 'other box does not exist, should never happen';

			otherTokenBox.numTokens = res.numOutput;
			otherTokenBox.dollars = res.dollarOutput;

			return {
				route: res.route,
				numOutput: res.numOutput,
				dollarOutput: res.dollarOutput,
				pairAddress: res.pairAddress,
				sufficientAllowance: res.sufficientAllowance
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

	async function setSwapData({ route, numOutput, dollarOutput, sufficientAllowance }: ISwapData) {
		canSwapLock = true;

		if (!currentTokenBox || !currentTokenBox.address || !otherTokenBox || !otherTokenBox.address)
			throw 'some required details not provdided, this should never happen';

		// const pairAddress = getPairAddress(
		// 	factory_address,
		// 	currentTokenBox.address,
		// 	otherTokenBox.address
		// );

		// TODO get pair address when calculation route

		swapData = {
			route: route,
			numOutput: numOutput,
			dollarOutput: dollarOutput,
			pairAddress: pairAddress,
			sufficientAllowance: sufficientAllowance
		};
	}

	/**
	 * @param _currentTokenBox is the token box holding the swap info
	 * @returns true if allowance is sufficient, otherwise returns false
	 */
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
