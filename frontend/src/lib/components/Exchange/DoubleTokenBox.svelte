<script context="module" lang="ts">
	import {
		swapExactInput,
		performLiquidity,
		approveMax,
		checkSufficientAllowance,
		getRoute
	} from '$lib/scripts/exchange';
	import { addDecimals, removeDecimals } from '$lib/scripts/exchange/utils/utils';
	import { BigNumber, utils } from 'ethers';
	import type { IExchangeContext } from '$lib/typesFrontend';
</script>

<script lang="ts">
	import TokenBox from './TokenBox.svelte';
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import PoolInfo from '$lib/components/Exchange/PoolInfo.svelte';

	let tokenBox1: TokenBox;
	let tokenBox2: TokenBox;
	let swapGuard = false;
	let currentTokenBox: TokenBox | null;
	let otherTokenBox: typeof currentTokenBox;

	// get context
	const { signerObj, nativeToken, dollarsToken, getFactory, getRouter }: IExchangeContext =
		getContext('exchange');

	const signer = signerObj.getSigner();
	const signerAddress = signerObj.getAddress();
	const nativeAddr = nativeToken.address;
	const dollarsAddr = dollarsToken.address;
	const factory = getFactory();
	const router = getRouter();

	let routeCache: string[] | null;


	export let slippage = 0.03;

	export async function action() {
		if(!tokenBox1.numTokens || !tokenBox2.numTokens || !tokenBox1.address || !tokenBox2.address) {
			alert("not enough info for swap")
			throw "not enough info for swap"
		}

		if (!routeCache) {
			console.log(routeCache);
			alert('route not set yet');
			throw 'route not set yet';
		}

		if ($page.path === '/exchange/swap') {
			const amountInExact = addDecimals(
				tokenBox1.numTokens as number,
				tokenBox1.decimals as number
			);
			const inputAddress = tokenBox1.address as string;

			const amountOutMin = addDecimals(
				(tokenBox2.numTokens as number) * (1 - slippage),
				tokenBox2.decimals as number
			);
			console.log(amountOutMin);

			if (
				!(await checkSufficientAllowance({
					toSpend: amountInExact,
					ownerAddr: signerAddress,
					spenderAddr: router.address,
					tokenAddr: inputAddress,
					signer: signer
				}))
			) {
				console.log('not enough allowance, approving max now');

				const tx = await approveMax({
					tokenAddress: tokenBox1.address as string,
					spenderAddress: router.address,
					signer: signer
				});
				await tx.wait();
			}

			const tx = await swapExactInput({
				amountInExact: amountInExact,
				amountOutMin: amountOutMin,
				route: routeCache,
				to: signerAddress,
				router: router,
				deadline: amountInExact
			}); // TODO change deadline to realistic number
			await tx.wait();
			updateBoxAfterSwap()

			alert('swap successfully performed');
		} else if ($page.path === '/exchange/liquidity') {
			await performLiquidity();
		} else {
			alert('Invalid page: This should never happen');
			throw 'bad page';
		}
	}

	function updateBoxAfterSwap() {
		tokenBox1.updateBalance();
		tokenBox2.updateBalance();
		tokenBox1.handleInput()
	}

	function updateCurrentTokenBox(_tokenBox: TokenBox) {
		if (_tokenBox === tokenBox1) {
			console.log('is tb1');
			currentTokenBox = tokenBox1;
			otherTokenBox = tokenBox2;
		} else {
			console.log('is tb2');
			currentTokenBox = tokenBox2;
			otherTokenBox = tokenBox1;
		}
	}

	async function getRouteIfCache() {
		if (!routeCache) {
			routeCache = await getRoute({
				addrIn: tokenBox1.address as string,
				addrOut: tokenBox2.address as string,
				factory: factory,
				nativeAddr: nativeAddr
			});
			return routeCache;
		} else {
			return routeCache;
		}
	}

	async function getSwapTopCurrent() {
		if (!currentTokenBox || !otherTokenBox) {
			alert('failed to update current token box correctly');
			throw 'failed to update current token box correctly, should never happen';
		}

		const amountInBig = addDecimals(tokenBox1.numTokens as number, tokenBox1.decimals as number);
		const route = await getRouteIfCache();
		const amountsOut = await router.getAmountsOut(amountInBig, route);
		const amountOut = amountsOut[amountsOut.length - 1];
		otherTokenBox.numTokens = removeDecimals(amountOut, otherTokenBox.decimals as number); // if address exists, decimals exist
	}

	async function getSwapBottomCurrent() {
		if (!currentTokenBox || !otherTokenBox) {
			alert('failed to update current token box correctly');
			throw 'failed to update current token box correctly, should never happen';
		}

		const amountOutBig = addDecimals(tokenBox2.numTokens as number, tokenBox2.decimals as number);
		const route = await getRouteIfCache();
		const amountsIn = await router.getAmountsIn(amountOutBig, route);
		const amountIn = amountsIn[0];
		otherTokenBox.numTokens = removeDecimals(amountIn, otherTokenBox.decimals as number); // if address exists, decimals exist
	}

	async function getSwap() {
		if (currentTokenBox === tokenBox1) {
			await getSwapTopCurrent()
		} else {
			await getSwapBottomCurrent()
		}
	}

	async function handleSelectionWithNumTokens() {
		// if other tokenBox also has address -> get route and output
		routeCache = null;

		if (!currentTokenBox || !otherTokenBox) {
			alert('failed to update current token box correctly');
			throw 'failed to update current token box correctly, should never happen';
		}

		if (otherTokenBox.address) {
			console.log('factory:', factory);

			await getSwap();
		}
	}

	async function handleSelectionWithoutNumTokens() {
		// if other tokenBox only has address -> get route
		// else if other tokenBox also has numTokens -> get route and output
		// _tokenBox cannot be currentTokenBox. currentTokenBox might not even exist
		routeCache = null;

		if (currentTokenBox && currentTokenBox.address) {
			if (!currentTokenBox || !otherTokenBox) {
				alert('failed to update current token box correctly');
				throw 'failed to update current token box correctly, should never happen';
			}

			await getSwap();
		}
	}
	async function handleInputWithAddress(_tokenBox: TokenBox, e: CustomEvent<any>) {
		// check if other tokenBox has address -> get output (route already gotten)
		// _tokenBox is currentTokenBox
		updateCurrentTokenBox(_tokenBox);

		if (otherTokenBox?.address) {
			await getSwap();
		}
	}
	function handleInputWithoutAddress(_tokenBox: TokenBox) {
		// cannot do anything here except update current
		updateCurrentTokenBox(_tokenBox);
	}
</script>

<div class="token-box">
	<TokenBox
		bind:this={tokenBox1}
		on:tokenSelectedWithNumTokens={(e) => handleSelectionWithNumTokens()}
		on:tokenSelectedWithoutNumTokens={(e) => handleSelectionWithoutNumTokens()}
		on:tokenNumInputWithAddress={(e) => handleInputWithAddress(tokenBox1, e)}
		on:tokenNumInputWithoutAddress={() => handleInputWithoutAddress(tokenBox1)}
	/>
</div>

<div class="token-box">
	<TokenBox
		bind:this={tokenBox2}
		on:tokenSelectedWithNumTokens={(e) => handleSelectionWithNumTokens()}
		on:tokenSelectedWithoutNumTokens={(e) => handleSelectionWithoutNumTokens()}
		on:tokenNumInputWithAddress={(e) => handleInputWithAddress(tokenBox2, e)}
		on:tokenNumInputWithoutAddress={() => handleInputWithoutAddress(tokenBox2)}
	/>
</div>

<style>
</style>
