<script context="module" lang="ts">
	import {
		swapExactInput,
		performLiquidity,
		approveMax,
		NoMetaMaskError,
		checkAllowance,
		getQuote,
		getRoute,
		getAll,
getNumOutputAndPIFromRoute
	} from '$lib/scripts/exchange';
	import { addDecimals, removeDecimals } from '$lib/scripts/exchange/utils/utils';
	import { BigNumber, Contract } from 'ethers';
	import type { JsonRpcSigner} from '@ethersproject/providers'
	import type { Ierc20, UniswapV2Factory } from '$lib/typesUsed';
</script>

<script lang="ts">
	import TokenBox from './TokenBox.svelte';
	import { page } from '$app/stores';
	import { ERC20ABI } from '$lib/abis';
	import { getContext } from 'svelte';

	let tokenBox1: TokenBox;
	let tokenBox2: TokenBox;
	let canSwapLock = false;
	let currentTokenBox: TokenBox | undefined;
	let otherTokenBox: TokenBox | undefined;

	export let signer: JsonRpcSigner;
	export let signerAddress: string;

	const {factory, router} = getContext("exchange")


	let routeCache: {
		route: string[];
		toAndFrom: [string, string];
		timestamp: number;
		swapRate?: number; // 1 to = ? from
	} = Object.freeze({
		route: [],
		toAndFrom: ["",""],
		timestamp: 0,
		swapRate: 0
	});

	type RouteCache = {
		route: string[],
		toAndFrom: string[],
		timestamp: number,
		swapRate: number,
		numInput: number
	}

	async function setRouteCache({
		route,
		toAndFrom,
		timestamp,
		swapRate,
		numInput
	}: {
		route: string[];
		toAndFrom: string[];
		timestamp: number;
		swapRate?: number;
		numInput?: number
	}) {
		// first set routeCache regardless of whether rate provided or not
		routeCache = Object.freeze({
			route: route,
			toAndFrom: toAndFrom,
			timestamp: timestamp,
			swapRate: swapRate
		});

		if(!swapRate) {
			// if swapRate was not provided, get it and set route cache
			const {numOutput} = await getNumOutputAndPIFromRoute({route: route, factoryAddr: factory?.address, signer: signer, numInput: BigNumber.from(numInput)})


		}

	}

	const { nativeAddr, dollarAddr } = getContext('exchange');

	export async function perform() {
		if ($page.path === '/swap') {
			if (!(await checkAllowance())) {
				approveMax();
			}

			await performSwap();
		} else if ($page.path === '/liquidity') {
			await performLiquidity();
		} else {
			alert('Invalid pageThis should never happen');
		}
	}

	async function handleSelectionGeneric(tokenBox: TokenBox, e: any) {
		canSwapLock = false;
		tokenBox.address = e.detail.address as string;

		if (!tokenBox.address) throw 'address does not exist for selection, this should never happen';

		// TODO move to validation function, although typescript didn't enjoy that, try without parameters and use global variables
		if (!signer || !signerAddress) {
			alert('Connect to metamask');
			throw new NoMetaMaskError('Please connect to metamask');
		}

		const tokenInstance = new Contract(tokenBox.address, ERC20ABI, signer) as Ierc20;
		// decimals needed for future calculations so must be synchronous
		const decimals = await tokenInstance
			.decimals()
			.then((decimals) => (tokenBox.decimals = decimals));

		// set balance asynchronously
		tokenInstance
			.balanceOf(signerAddress)
			.then((balance) => (tokenBox.balance = removeDecimals(balance, decimals)));

		// TODO use typescript to fix unnessary check for tokenBox.numtokens, because if currentTokenBox exists, it will too
		if (currentTokenBox === tokenBox) {
			// Scenario 1 and 2
			// can't swap yet, can only get dollar value

			// getting dollars can be done asynchronously since other calculations do not need it
			const getDollarsProm = getQuote({
				addrInput: tokenBox.address,
				dollarsAddr: dollarAddr,
				numInput: addDecimals(tokenBox.numTokens as number, decimals),
				nativeAddr: nativeAddr,
				factory: factory,
				signer: signer
			})
				.then((res) => (tokenBox.dollars = removeDecimals(res, decimals)))
				.catch((error) => {
					alert('unable to get dollar value');
					console.log(error);
					throw 'unable to get dollar value';
				});

			if (otherTokenBox && otherTokenBox.address) {
				// otherTokenBox has also been selected, so we can get its corresponding output tokens
				// currentTokenBox (= tokenBox) is the input

				getAll({
					addrInput: tokenBox.address as string,
					addrOutput: otherTokenBox.address as string,
					numInput: addDecimals(tokenBox.numTokens as number, decimals),
					factory: factory as UniswapV2Factory, // have checked factory and signer already
					nativeAddr: nativeAddr,
					signer: signer as Signer
				})
					.then(({ route, numOutput, priceImpact }) => {
						if (!otherTokenBox?.decimals) {
							alert('decimals not retrieved yet for other token box');
							throw 'decimals not retrieved yet for other token box';
						}
						otherTokenBox!.numTokens = removeDecimals(numOutput, otherTokenBox.decimals);

						canSwapLock = true;
						setRouteCache({
							route: route,
							toAndFrom: [tokenBox.address as string, otherTokenBox!.address as string],
							timestamp: Date.now()
						});

						return Promise.all([getDollarsProm]).then((values) => {
							otherTokenBox!.dollars = calcOutputGivenPI(tokenBox.dollars as number, priceImpact);
						});
					})
					.catch((e) => {
						alert('error in getting values for swap');
						console.log('Error in getting values swap');
					});
			}
		} else if (currentTokenBox && currentTokenBox.address) {
			/**
			 * currentTokenBox does exist with an address, but it is not this one
			 * tokenBox = otherTokenBox
			 * if not current, but current exists with address,
			 * can't get dollar value here for tokenBox since no input since not current, and current will sort out its own dollar value
			 */

			if (!factory) {
				alert('no factory yet');
				throw 'no factory';
			}

			const _route = getRoute({
				addrInput: currentTokenBox.address,
				addrOutput: otherTokenBox!.address as string,
				factory: factory,
				nativeAddr: nativeAddr
			});

			set;

			if (currentTokenBox.numTokens) {
				getAll;
			}
		} else if (tokenBox1.address && tokenBox2.address) {
			/**
			 * currentTokenBox does not exist yet but both are selected
			 * Can only get route and reserves
			 */
		}
	}

	function getAllWrapper() {}

	async function handleInputGeneric(tokenBox: TokenBox, e: any) {
		canSwapLock = false;
		updateCurrentTokenBox(tokenBox);
		tokenBox.numTokens = e.detail.numTokens;

		if (!tokenBox.numTokens) throw 'that value does not exist, this should never happen';

		if (!factory || !nativeAddr || !signer) {
			alert('Connect to metamask');
			return;
		}

		if (tokenBox.address) {
			getDollarValue(tokenBox.address, tokenBox.numTokens)
				.then((res) => (tokenBox.dollars = res))
				.catch(alert);

			if (otherTokenBox && otherTokenBox.address) {
				// _tokenBox is input
				getAndSetSwapData(tokenBox);
			}
		}
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

	function calcOutputGivenPI(numInput: number, priceImpact: number) {
		return numInput * (1 - priceImpact);
	}

	/**
	 * @dev just gets the swap rate and dollar rates for the tokens, also caches
	 */
	function getRates() {
		console.log('implement get rates');
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
