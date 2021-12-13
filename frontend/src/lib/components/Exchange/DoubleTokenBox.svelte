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

	let routeCache: string[] | null;
	let canSwapGuard = false;

	export async function action() {
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

	function getFromRouteHelper(isInput: boolean) {
		if(!routeCache) {
			alert("route cache not available")
			throw "this should never happen"
		}
		return getNumInputOrOutputAndPIFromRoute({ route: routeCache, numInputOrOutput: addDecimals(currentTokenBox?.numTokens as number, currentTokenBox?.decimals as number), factoryAddr: factory.address, signer: signer, isInput: isInput })
	}

	async function handleSelectionWithNumTokens(_tokenBox: TokenBox, e: CustomEvent<any>) {
		// if other tokenBox also has address -> get route and output
		// _tokenBox is current
		canSwapGuard = false;
		routeCache = null;

		if(_tokenBox !== currentTokenBox || !currentTokenBox || !otherTokenBox) {
			alert("failed to update current token box correctly")
			throw "failed to update current token box correctly, should never happen"
		}
		
		if(otherTokenBox.address) {
			console.log("factory:", factory)

			if(_tokenBox === tokenBox1) {
				const {numInputOrOutput, priceImpact, route} = await getAllHelperCurrent(true)
				otherTokenBox.numTokens = calcOutputGivenPI(removeDecimals(numInputOrOutput, otherTokenBox.decimals as number), priceImpact) // if address exists, decimals exist
				routeCache = route;
			} else {
				const {numInputOrOutput, priceImpact, route} = await getAllHelperCurrent(false)
				otherTokenBox.numTokens = calcInputGivenPI(removeDecimals(numInputOrOutput, otherTokenBox.decimals as number), priceImpact) // if address exists, decimals exist
				routeCache = route;
			}
			canSwapGuard = true;
		}
	}

	async function handleSelectionWithoutNumTokens(_tokenBox: TokenBox, e: CustomEvent<any>) {
		// if other tokenBox only has address -> get route
		// else if other tokenBox also has numTokens -> get route and output
		// _tokenBox cannot be currentTokenBox. currentTokenBox might not even exist
		canSwapGuard = false;
		routeCache = null;

		if(currentTokenBox && currentTokenBox.address) {
			if(currentTokenBox === tokenBox1) {
				const {numInputOrOutput, priceImpact, route} = await getAllHelperCurrent(true)
				otherTokenBox!.numTokens = calcOutputGivenPI(removeDecimals(numInputOrOutput, currentTokenBox.decimals as number), priceImpact) // if address exists, decimals exist
				routeCache = route;
			} else {
				const {numInputOrOutput, priceImpact, route} = await getAllHelperCurrent(false)
				otherTokenBox!.numTokens = calcInputGivenPI(removeDecimals(numInputOrOutput, currentTokenBox.decimals as number), priceImpact) // if address exists, decimals exist
				routeCache = route;
			}
			canSwapGuard = true
		}

	}
	async function handleInputWithAddress(_tokenBox: TokenBox, e: CustomEvent<any>) {
		// check if other tokenBox has address -> get output (route already gotten)
		// _tokenBox is currentTokenBox
		canSwapGuard = false;
		updateCurrentTokenBox(_tokenBox)

		if(otherTokenBox?.address) {
			if(_tokenBox === tokenBox1) {
				if(!routeCache){
					const {numInputOrOutput, priceImpact, route} = await getAllHelperCurrent(true)
					otherTokenBox.numTokens = calcOutputGivenPI(removeDecimals(numInputOrOutput, otherTokenBox.decimals as number), priceImpact) // if address exists, decimals exist
					routeCache = route;
				} else {
					console.log('using route cache')
					const {numInputOrOutput, priceImpact} = await getFromRouteHelper(true);
					otherTokenBox.numTokens = calcOutputGivenPI(removeDecimals(numInputOrOutput, otherTokenBox.decimals as number), priceImpact) // if address exists, decimals exist
				}
			} else {
				if(!routeCache) {
					const {numInputOrOutput, priceImpact, route} = await getAllHelperCurrent(false)
					otherTokenBox.numTokens = calcInputGivenPI(removeDecimals(numInputOrOutput, otherTokenBox.decimals as number), priceImpact) // if address exists, decimals exist
					routeCache = route;
				} else {
					console.log('using route cache')
					const {numInputOrOutput, priceImpact} = await getFromRouteHelper(false);
					otherTokenBox.numTokens = calcInputGivenPI(removeDecimals(numInputOrOutput, otherTokenBox.decimals as number), priceImpact)
				}
			}
			canSwapGuard= true
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
