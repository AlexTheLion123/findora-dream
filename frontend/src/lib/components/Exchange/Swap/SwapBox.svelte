<script context="module" lang="ts">
	import {
		swapExactInput,
		approveMax,
		checkSufficientAllowance,
		getRoute,
		formatBoxOutput, formatNumber, checkAllowanceAndApproveMax
	} from '$lib/scripts/exchange';
	import { addDecimals, removeDecimals } from '$lib/scripts/exchange/utils';
	import type { IExchangeContext } from '$lib/typesFrontend';
</script>

<script lang="ts">
	import TokenBox from '../TokenBox/TokenBox.svelte';
	import { page } from '$app/stores';
	import { getContext } from 'svelte';

	let tokenBox1: TokenBox;
	let tokenBox2: TokenBox;
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

	let amount1: number;
	let amount2: number;
	let address1: string;
	let address2: string;
	let decimals1: number;
	let decimals2: number;

	let routeCache: string[] | null;


	export let slippage = 0.03;

	export async function action() {
		if(!amount1 || !amount2 || !address1 || !address2) {
			alert("not enough info for swap")
			throw "not enough info for swap"
		}

		if (!routeCache) {
			alert('route not set yet');
			throw 'route not set yet';
		}

			const amountInExact = addDecimals(
				amount1 as number,
				decimals1 as number
			);
			const inputAddress = address1 as string;

			console.log(inputAddress, "input address")
			
			const amountOutMin = addDecimals(
				(amount2 as number) * (1 - slippage),
				decimals2 as number
			);

			await checkAllowanceAndApproveMax({
					toSpend: amountInExact,
					ownerAddr: signerAddress,
					spenderAddr: router.address,
					tokenAddr: inputAddress,
					signer: signer
			})

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

	}

	function updateBoxAfterSwap() {
		tokenBox1.updateBalance();
		tokenBox2.updateBalance();
		tokenBox1.handleInput()
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

	async function getRouteIfCache() {
		if (!routeCache) {
			routeCache = await getRoute({
				addrIn: address1 as string,
				addrOut: address2 as string,
				factory: factory,
				nativeAddr: nativeAddr
			});
			return routeCache;
		} else {
			return routeCache;
		}
	}

	async function getSwapTopCurrent() {
		const amountInBig = addDecimals(amount1 as number, decimals1 as number);
		const route = await getRouteIfCache();
		const amountsOut = await router.getAmountsOut(amountInBig, route);
		const amountOut = amountsOut[amountsOut.length - 1];
		amount2 = formatNumber(removeDecimals(amountOut, decimals2), 4); // if address exists, decimals exist
	}

	async function getSwapBottomCurrent() {
		const amountOutBig = addDecimals(amount2 as number, decimals2 as number);
		const route = await getRouteIfCache();
		const amountsIn = await router.getAmountsIn(amountOutBig, route);
		const amountIn = amountsIn[0];
		amount1 = formatNumber(removeDecimals(amountIn, decimals1), 4); // if address exists, decimals exist
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

		if (otherTokenBox?.address) {
			await getSwap();
		}
	}

	async function handleSelectionWithoutNumTokens() {
		// if other tokenBox only has address -> get route
		// else if other tokenBox also has numTokens -> get route and output
		// _tokenBox cannot be currentTokenBox. currentTokenBox might not even exist
		routeCache = null;

		if (currentTokenBox && currentTokenBox.address) {
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
		bind:numTokens={amount1}
		bind:address={address1}
		bind:decimals={decimals1}
		on:tokenSelectedWithNumTokens={(e) => handleSelectionWithNumTokens()}
		on:tokenSelectedWithoutNumTokens={(e) => handleSelectionWithoutNumTokens()}
		on:tokenNumInputWithAddress={(e) => handleInputWithAddress(tokenBox1, e)}
		on:tokenNumInputWithoutAddress={() => handleInputWithoutAddress(tokenBox1)}
	/>
</div>

<div class="token-box">
	<TokenBox
		bind:this={tokenBox2}
		bind:numTokens={amount2}
		bind:address={address2}
		bind:decimals={decimals2}
		on:tokenSelectedWithNumTokens={(e) => handleSelectionWithNumTokens()}
		on:tokenSelectedWithoutNumTokens={(e) => handleSelectionWithoutNumTokens()}
		on:tokenNumInputWithAddress={(e) => handleInputWithAddress(tokenBox2, e)}
		on:tokenNumInputWithoutAddress={() => handleInputWithoutAddress(tokenBox2)}
	/>
</div>
