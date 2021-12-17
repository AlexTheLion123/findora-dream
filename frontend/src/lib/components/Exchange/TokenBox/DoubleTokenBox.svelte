<script context="module" lang="ts">
	import {
		swapExactInput,
		approveMax,
		checkSufficientAllowance,
		getRoute,
		formatBoxOutput,
		formatNumber,
		checkAllowanceAndApproveMax
	} from '$lib/scripts/exchange';
	import { addDecimals, removeDecimals } from '$lib/scripts/exchange/utils';
	import type { IExchangeContext } from '$lib/typesFrontend';
</script>

<script lang="ts">
	import TokenBox from '../TokenBox/TokenBox.svelte';
	import { getContext } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	let currentTokenBox: TokenBox | null;
	let otherTokenBox: typeof currentTokenBox;
	
    export let routeCache: string[] | null;
	export let slippage = 0.03;

	export let amount1: number;
	export let amount2: number;
	export let address1: string;
	export let address2: string;
	export let decimals1: number;
	export let decimals2: number;

	export let status: string;
	$: console.log("double token box", status)

    let tokenBox1: TokenBox;
	let tokenBox2: TokenBox;

    
	// get context
	const { nativeToken, getFactory }: IExchangeContext = getContext('exchange');
	const nativeAddr = nativeToken.address;
	const factory = getFactory();

	const dispatch = createEventDispatcher();

	function updateCurrentTokenBox(_tokenBox: TokenBox) {
		if (_tokenBox === tokenBox1) {
			currentTokenBox = tokenBox1;
			otherTokenBox = tokenBox2;
		} else {
			currentTokenBox = tokenBox2;
			otherTokenBox = tokenBox1;
		}
	}

    function getCurrentBox(){
        if(currentTokenBox === tokenBox1) return 1;
        else if(currentTokenBox === tokenBox2) return 2;
        else return 0;
    }

	async function getRouteIfCache() {
		if (!address1 || !address2) {
			return null;
		}

		if (!routeCache) {
			return await getRoute({
				addrIn: address1 as string,
				addrOut: address2 as string,
				factory: factory,
				nativeAddr: nativeAddr
			});
		} else {
			return routeCache;
		}
	}

	function updateStatus() {
		if(!address1 || !address2) {
			status = "select token"
			return;
		}
		if((address1 && address2 && !amount1) || (address2 && address1 && !amount2)) {
			status = "enter amount"
			return;
		}
		if((address1 && address2 && amount1) || (address2 && address1 && amount2)) {
			status = "swap"
		}	
	}

	async function handleSelectionWithNumTokens() {
		routeCache = null;
        routeCache = await getRouteIfCache();

		updateStatus();
		dispatch('selectionWithTokens', {
			num: getCurrentBox()
		});
	}

	async function handleSelectionWithoutNumTokens() {
		routeCache = null;
        routeCache = await getRouteIfCache();

		updateStatus();
		dispatch('selectionWithoutTokens', {
            num: getCurrentBox()
        });
	}
	async function handleInputWithAddress(_tokenBox: TokenBox, e: CustomEvent<any>) {
		routeCache = await getRouteIfCache();
		updateCurrentTokenBox(_tokenBox);
		updateStatus();
		dispatch('inputWithAddress', {
            num: getCurrentBox()
        });
	}
	async function handleInputWithoutAddress(_tokenBox: TokenBox) {
		routeCache = await getRouteIfCache();
		updateStatus();
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
