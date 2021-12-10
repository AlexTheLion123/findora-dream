<script context="module" lang="ts">
	import {
		swapExactInput,
		performLiquidity,
		approveMax,
		NoMetaMaskError,
		checkAllowance,
		getQuote,
		getRoute,
		getAll
	} from '$lib/scripts/exchange';
	import { addDecimals, removeDecimals } from '$lib/scripts/exchange/utils/utils';
	import { Contract, Signer } from 'ethers';
	import type { Ierc20, UniswapV2Factory } from '$lib/typesUsed';
</script>

<script lang="ts">
	import TokenBox from './TokenBox.svelte';
	import { factory, router, signer, signerAddress } from '$lib/stores';
	import { page } from '$app/stores';
	import { ERC20ABI } from '$lib/abis';
	import { getContext } from 'svelte';

	let tokenBox1: TokenBox;
	let tokenBox2: TokenBox;
	let canSwapLock = false;
	let currentTokenBox: TokenBox | undefined;
	let otherTokenBox: TokenBox | undefined;

	const { nativeAddr, dollarAddr } = getContext('exchange');

	async function perform() {
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
		tokenBox.address = e.detail.address;

		if (!tokenBox.address) throw 'address does not exist for selection, this should never happen';

		// TODO move to validation function, although typescript didn't enjoy that, try without parameters and use global variables
		if (!$signer) {
			alert('Connect to metamask');
			throw new NoMetaMaskError('Please connect to metamask');
		}

		const getBalanceAndDecimals = (new Contract(tokenBox.address, ERC20ABI, $signer) as Ierc20)
			.deployed()
			.then(async (res) => {
				tokenBox.decimals = await res.decimals();

				if (!$signerAddress || !tokenBox.address) {
					alert('Connect to metamask');
					throw new NoMetaMaskError('Please connect to metamask');
				}

				return res
					.balanceOf($signerAddress)
					.then((res) => (tokenBox.balance = removeDecimals(res, tokenBox.decimals as number)));
			})
			.catch((e) => {
				alert('No contract deployed here or failed to get coin info');
				throw 'No contract deployed here or failed to get coin info';
			});

		if (currentTokenBox === tokenBox) {
			// Scenario 1 and 2

			// can't swap yet, can only get dollar value
			if (!tokenBox.numTokens || !tokenBox.decimals || !$factory)
				throw 'details not fetched yet, should probably never happen';

			const getDollars = getQuote({
				addrInput: tokenBox.address,
				dollarsAddr: dollarAddr,
				numInput: addDecimals(tokenBox.numTokens, tokenBox.decimals),
				nativeAddr: nativeAddr,
				factory: $factory,
				signer: $signer
			})
				.then((res) => (tokenBox.dollars = removeDecimals(res, tokenBox.decimals as number)))
				.catch((error) => {
					alert('unable to get dollar value');
					console.log(error);
					throw 'unable to get dollar value';
				});

			if (otherTokenBox && otherTokenBox.address) {
				// otherTokenBox has also been selected, so we can get its corresponding output tokens
				// currentTokenBox (= tokenBox) is the input

				Promise.all([getBalanceAndDecimals]).then((values) => {
					// this promise sets all the relevant values, so we can force typescript to accept values

					getAll({
						addrInput: tokenBox.address as string,
						addrOutput: otherTokenBox!.address as string,
						numInput: addDecimals(tokenBox.numTokens as number, tokenBox.decimals as number),
						factory: $factory as UniswapV2Factory, // have checked factory and signer already
						nativeAddr: nativeAddr,
						signer: $signer as Signer
					})
						.then(({ numOutput, priceImpact }) => {
							return Promise.all([getDollars]).then((values) => {
								if (!otherTokenBox?.decimals) {
									alert('decimals not retrieved yet for other token box');
									throw 'decimals not retrieved yet for other token box';
								}

								otherTokenBox!.numTokens = removeDecimals(numOutput, otherTokenBox.decimals);
								otherTokenBox!.dollars = calcOutputGivenPI(tokenBox.dollars as number, priceImpact);
							});
						})
						.catch((e) => {
							alert('error in getting values for swap');
							console.log('Error in getting values swap');
						});
				});
			}
		} else if (currentTokenBox && otherTokenBox) {
			// if not current, but current exists, can't get dollar value here since no input since not current

			if (currentTokenBox.address) {
				getRates();

				if (currentTokenBox.numTokens) {
					// otherTokenBox is the input
					await getAndSetSwapData(currentTokenBox).catch(alert);
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

	async function handleInputGeneric(tokenBox: TokenBox, e: any) {
		canSwapLock = false;
		updateCurrentTokenBox(tokenBox);
		tokenBox.numTokens = e.detail.numTokens;

		if (!tokenBox.numTokens) throw 'that value does not exist, this should never happen';

		if (!$factory || !nativeAddr || !$signer) {
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
