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

	/**
	 * TODO delete below, new code at bottom
	 */

	async function handleSelectionGeneric(tokenBox: TokenBox, e: any) {
		swapGuard = false;
		tokenBox.address = e.detail.address as string;

		if (!tokenBox.address) throw 'address does not exist for selection, this should never happen';

		// TODO use typescript to fix unnessary check for tokenBox.numtokens, because if currentTokenBox exists, it will too
		if (currentTokenBox === tokenBox) {
			// can't swap yet, can only get dollar value

			// getting dollars can be done asynchronously since other calculations do not need it
			const getDollarsProm = getQuote({
				addrInput: tokenBox.address,
				addrOutput: dollarsAddr,
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
					factory: factory, // have checked factory and signer already
					nativeAddr: nativeAddr,
					signer: signer
				})
					.then(({ route, numOutput, priceImpact }) => {
						if (!otherTokenBox?.decimals) {
							alert('decimals not retrieved yet for other token box');
							throw 'decimals not retrieved yet for other token box';
						}
						otherTokenBox!.numTokens = removeDecimals(numOutput, otherTokenBox.decimals);

						swapGuard = true;
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
		swapGuard = false;
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


	/**
	 * TODO delete above, new code below
	 */

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
	function handleInputWithAddress(_tokenBox: TokenBox, e: CustomEvent<any>) {
		// check if other tokenBox has address -> get output (route already gotten)
		// _tokenBox is currentTokenBox

		console.log("updating current with address")
		updateCurrentTokenBox(_tokenBox)
	}
	function handleInputWithoutAddress(_tokenBox: TokenBox) {

		console.log("updating current without address");
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
