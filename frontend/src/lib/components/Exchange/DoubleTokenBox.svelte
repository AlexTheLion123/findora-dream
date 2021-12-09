<script context="module" lang="ts">
	import {
		performSwap,
		performLiquidity,
		getDollarValue,
		approveMax,
		NoMetaMaskError,
		getBalance,
		getExactSwapData
	} from '$lib/scripts/exchange';

	import type {TySwapData, ISetSwapDataOutput, ISetSwapDataInput } from '$lib/typesFrontend';
</script>

<script lang="ts">
	import TokenBox from './TokenBox.svelte';
	import { factory, nativeTokenAddress, router, signer, signerAddress } from '$lib/stores';
	import { page } from '$app/stores';

	let tokenBox1: TokenBox;
	let tokenBox2: TokenBox;
	let canSwapLock = false;
	let swapData: TySwapData;
	let currentTokenBox: TokenBox | undefined;
	let otherTokenBox: TokenBox | undefined;

	export async function perform() {
		if (!canSwapLock) {
			alert('Swap is locked');
			throw "Swap is locked";
		}

		if (
			!currentTokenBox ||
			!otherTokenBox ||
			!currentTokenBox.numTokens ||
			!otherTokenBox.numTokens ||
			!$factory ||
			!$router ||
			!$signerAddress ||
			!$signer
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
				$signerAddress,
				$router,
				$signer,
				100
			);
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
		if (!$factory || !$nativeTokenAddress || !$signer || !$signerAddress) {
			alert('Connect to metamask');
			throw new NoMetaMaskError('Please connect to metamask');
		}

		getBalance(tokenBox.address, tokenBox.decimals, $signer, $signerAddress)
			.then((res) => {
				tokenBox.balance = res;
			})
			.catch(alert);

		if (currentTokenBox === tokenBox) {
			// Scenario 1 and 2

			// can't swap yet, can only get dollar value
			if (!tokenBox.numTokens) throw 'this should never happen';
			getDollarValue(tokenBox.address, tokenBox.numTokens)
				.then((res) => {
					tokenBox.dollars = res;
				})
				.catch(alert);

			if (otherTokenBox && otherTokenBox.address) {
				// otherTokenBox has also been selected, so we can get its corresponding output tokens

				// _tokenBox is the input
				await getAndSetSwapData(tokenBox).catch(alert);
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
		updateCurrentTokenBox(tokenBox);
		tokenBox.numTokens = e.detail.numTokens;
		if (!tokenBox.numTokens) throw 'that value does not exist, this should never happen';

		if (!$factory || !$nativeTokenAddress || !$signer) {
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

	function getAndSetSwapData(tokenBox: TokenBox) {
		return getSwapData(tokenBox).then(setSwapData);
	}

	function setSwapDataInput({numTokens, addr, decimals, sufficientAllowance}: ISetSwapDataInput) {

	}

	

	function setSwapDataOutput({numTokens, addr, decimals}: ISetSwapDataOutput) {

	}

	/// @dev gets data not crucial to performing swap, such as dollar values, price impact <- gonna have to do entire calc manually?
	function getPeripharyData() {

	}

	type TSwapData = typeof setSwapDataInput & ReturnType<setSwapDataOutput>;

	/// @param _tokenBox In this case, tokenBox should always just be the current token box
	function getSwapData(tokenBox: TokenBox) {
		if (tokenBox !== currentTokenBox) throw 'not current box, should never happen';

		if (
			!otherTokenBox ||
			!currentTokenBox.address ||
			!otherTokenBox.address ||
			!currentTokenBox.numTokens
		)
			throw "some required values haven't been provided, this should never happen";

		// TODO move to validation function, although typescript didn't enjoy that, try without parameters and use global variables
		if (
			!$factory ||
			!$nativeTokenAddress ||
			!$signer ||
			!$router ||
			!$router.address ||
			!$signerAddress
		) {
			alert('Connect to metamask');
			throw new NoMetaMaskError('Please connect to metamask');
		}

		return getExactSwapData(
			{
				addrInput: currentTokenBox.address,
				addrOutput: otherTokenBox.address,
				numInput: currentTokenBox.numTokens,
				decimals: currentTokenBox.decimals
			},
			{
				factory: $factory,
				nativeAddr: $nativeTokenAddress,
				signer: $signer,
				signerAddr: $signerAddress,
				router: $router
			}
		).then((res) => {
			if (!otherTokenBox) throw 'other box does not exist, should never happen';

			otherTokenBox.numTokens = res.numOutput;
			otherTokenBox.dollars = res.dollarOutput;

			return {
				route: res.route,
				numInput: res.numInput,
				numOutput: res.numOutput,
				addrInput: res.addrInput,
				addrOutput: res.addrOutput,
				decimals: res.decimals,
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

		swapData = {
			route: route,
			numOutput: numOutput,
			dollarOutput: dollarOutput,
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
