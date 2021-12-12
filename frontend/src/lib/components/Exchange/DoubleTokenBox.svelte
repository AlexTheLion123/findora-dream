<script context="module" lang="ts">
	import {
		swapExactInput,
		performLiquidity,
		approveMax,
		NoMetaMaskError,
		checkAllowance,
		getQuote,
		getRoute,
		getNumInputOrOutputAndPIFromRoute,
getAll,
	} from '$lib/scripts/exchange';
	import { addDecimals, removeDecimals } from '$lib/scripts/exchange/utils/utils';
	import type { BigNumber } from 'ethers';
</script>

<script lang="ts">
	import TokenBox from './TokenBox.svelte';
	import { page } from '$app/stores';
	import { getContext } from 'svelte';

	let tokenBox1: TokenBox;
	let tokenBox2: TokenBox;
	let swapGuard = false;
	let currentTokenBox: TokenBox | null;
	let otherTokenBox: typeof currentTokenBox;
	let routeCache: RouteCache;

	// get context
	const {
		signerObj,
		nativeToken,
		dollarsToken,
		getFactory
	} = getContext('exchange');

	const signer = signerObj.getSigner();
	const signerAddress = signerObj.getAddress();
	const nativeAddr = nativeToken.address;
	const dollarsAddr = dollarsToken.address
	const factory = getFactory();

	type RouteCache = {
		route: string[];
		toAndFrom: string[];
		timestamp: number;
		swapRate: BigNumber | Promise<BigNumber>; // 1000000 in = ? out
	};

	async function setRouteCache({
		route,
		toAndFrom
	}: {
		route: string[];
		toAndFrom: [string, string];
	}) {
		(routeCache.route = route),
			(routeCache.toAndFrom = toAndFrom),
			(routeCache.timestamp = Date.now());

		if (
			routeCache &&
			routeCache.toAndFrom === toAndFrom &&
			Date.now() - routeCache.timestamp < 10000
		) {
			// if we've already collected data and its the same, and 10 seconds haven't elapsed since last data collection, return.
			return;
		}

		// if swapRate was not provided, get it and set route cache
		// routeCache.swapRate = new Promise(async (resolve) => {
		// 	const {numOutput} = await getNumInputOrOutputAndPIFromRoute({
		// 		route: route,
		// 		factoryAddr: factory?.address,
		// 		signer: signer,
		// 		numInput: BigNumber.from(1000000)
		// 	})
		// 	resolve(numOutput)
		// });
	}

	function getRouteAgain(): boolean {
		return false
	}


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

	function updateCurrentTokenBox(_tokenBox: TokenBox) {
		if (_tokenBox === tokenBox1) {
			console.log("is tb1")
			currentTokenBox = tokenBox1;
			otherTokenBox = tokenBox2;
		} else {
			console.log("is tb2")
			currentTokenBox = tokenBox2;
			otherTokenBox = tokenBox1;
		}
	}

	function calcOutputGivenPI(numInput: number, priceImpact: number) {
		return numInput * (1 - priceImpact);
	}

	function calcInputGivenPI(numOutput: number, priceImpact: number) {
		return numOutput / (1- priceImpact);
	}


	

	async function getAllHelperCurrent(isInput: boolean) {
		const {numInputOrOutput, priceImpact, route} = isInput ? await getAll({
					addrP: currentTokenBox!.address as string,
					addrQ: otherTokenBox!.address as string,
					numInputOrOutput: addDecimals(currentTokenBox!.numTokens as number, currentTokenBox!.decimals as number),
					factory: factory,
					nativeAddr: nativeAddr,
					signer: signer,
					isInput: true
				}) : await getAll({
					addrP: currentTokenBox!.address as string,
					addrQ: otherTokenBox!.address as string,
					numInputOrOutput: addDecimals(currentTokenBox!.numTokens as number, currentTokenBox!.decimals as number),
					factory: factory,
					nativeAddr: nativeAddr,
					signer: signer,
					isInput: false
				})

		return {numInputOrOutput, priceImpact, route}
	}

	async function handleSelectionWithNumTokens(_tokenBox: TokenBox, e: CustomEvent<any>) {
		// if other tokenBox also has address -> get route and output
		// _tokenBox is current

		if(_tokenBox !== currentTokenBox || !currentTokenBox || !otherTokenBox) {
			alert("failed to update current token box correctly")
			throw "failed to update current token box correctly, should never happen"
		}
		
		if(otherTokenBox.address) {
			console.log("factory:", factory)

			if(_tokenBox === tokenBox1) {
				const {numInputOrOutput, priceImpact, route} = await getAllHelperCurrent(true)
				otherTokenBox.numTokens = calcOutputGivenPI(removeDecimals(numInputOrOutput, otherTokenBox.decimals as number), priceImpact) // if address exists, decimals exist
			} else {
				const {numInputOrOutput, priceImpact, route} = await getAllHelperCurrent(false)
				otherTokenBox.numTokens = calcInputGivenPI(removeDecimals(numInputOrOutput, otherTokenBox.decimals as number), priceImpact) // if address exists, decimals exist
			}

		}
	}

	async function handleSelectionWithoutNumTokens(_tokenBox: TokenBox, e: CustomEvent<any>) {
		// if other tokenBox only has address -> get route
		// else if other tokenBox also has numTokens -> get route and output
		// _tokenBox cannot be currentTokenBox. currentTokenBox might not even exist

		if(currentTokenBox && currentTokenBox.address) {
			if(currentTokenBox === tokenBox1) {
				const {numInputOrOutput, priceImpact, route} = await getAllHelperCurrent(true)
				otherTokenBox!.numTokens = calcOutputGivenPI(removeDecimals(numInputOrOutput, currentTokenBox.decimals as number), priceImpact) // if address exists, decimals exist
			} else {
				const {numInputOrOutput, priceImpact, route} = await getAllHelperCurrent(false)
				otherTokenBox!.numTokens = calcInputGivenPI(removeDecimals(numInputOrOutput, currentTokenBox.decimals as number), priceImpact) // if address exists, decimals exist
			}
		}

	}
	async function handleInputWithAddress(_tokenBox: TokenBox, e: CustomEvent<any>) {
		// check if other tokenBox has address -> get output (route already gotten)
		// _tokenBox is currentTokenBox

		updateCurrentTokenBox(_tokenBox)

		if(otherTokenBox?.address) {
			if(_tokenBox === tokenBox1) {
				const {numInputOrOutput, priceImpact, route} = await getAllHelperCurrent(true)
				otherTokenBox.numTokens = calcOutputGivenPI(removeDecimals(numInputOrOutput, otherTokenBox.decimals as number), priceImpact) // if address exists, decimals exist
			} else {
				const {numInputOrOutput, priceImpact, route} = await getAllHelperCurrent(false)
				otherTokenBox.numTokens = calcInputGivenPI(removeDecimals(numInputOrOutput, otherTokenBox.decimals as number), priceImpact) // if address exists, decimals exist
			}
		}
	}
	function handleInputWithoutAddress(_tokenBox: TokenBox) {
		// cannot do anything here except update current

		updateCurrentTokenBox(_tokenBox)

	}
</script>

<div class="token-box">
	<TokenBox
		bind:this={tokenBox1}
		on:tokenSelectedWithNumTokens={(e) => handleSelectionWithNumTokens(tokenBox1, e)}
		on:tokenSelectedWithoutNumTokens={(e) => handleSelectionWithoutNumTokens(tokenBox1, e)}
		on:tokenNumInputWithAddress={e => handleInputWithAddress(tokenBox1, e)}
		on:tokenNumInputWithoutAddress={() => handleInputWithoutAddress(tokenBox1)}
	/>
</div>

<div class="token-box">
	<TokenBox
		bind:this={tokenBox2}
		on:tokenSelectedWithNumTokens={(e) => handleSelectionWithNumTokens(tokenBox2, e)}
		on:tokenSelectedWithoutNumTokens={(e) => handleSelectionWithoutNumTokens(tokenBox2, e)}
		on:tokenNumInputWithAddress={e => handleInputWithAddress(tokenBox2, e)}
		on:tokenNumInputWithoutAddress={() => handleInputWithoutAddress(tokenBox2)}
	/>
</div>

<style>
</style>
