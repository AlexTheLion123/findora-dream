<script context="module" lang="ts">
	import {
		getRoute,
	} from '$lib/scripts/exchange';
	import type { IExchangeContext } from '$lib/typesFrontend';
</script>

<script lang="ts">
	import TokenBox from '../TokenBox/TokenBox.svelte';
	import { getContext } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	let currentTokenBox: TokenBox | null;
	let otherTokenBox: typeof currentTokenBox;

	export let status: string;
	export let amount1: number;
	export let amount2: number;
	export let address1: string;
	export let address2: string;
	export let decimals1: number;
	export let decimals2: number;
	export let updateCurrent1 = false;
	export let updateCurrent2 = false;


	$: if(!(address1 && address2)) {
		status = "select token"
	} else if(address1 && address2 && !(amount1 && amount2)) {
		status = "enter amount"
	} else if(address1 && address2 && amount1 && amount2) {
		status = "action"
	}

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

	function handleSelectionWithNumTokens() {
		dispatch('selectionWithTokens', {
			num: getCurrentBox()
		});
	}

	function handleSelectionWithoutNumTokens() {
		dispatch('selectionWithoutTokens', {
            num: getCurrentBox()
        });
	}
	function handleInputWithAddress(_tokenBox: TokenBox, e: CustomEvent<any>) {
		updateCurrentTokenBox(_tokenBox);

		dispatch('inputWithAddress', {
            num: getCurrentBox()
        });
	}
	function handleInputWithoutAddress(_tokenBox: TokenBox) {
		updateCurrentTokenBox(_tokenBox);
	}
</script>

<div class="token-box">
	<TokenBox
		bind:this={tokenBox1}
		bind:numTokens={amount1}
		bind:address={address1}
		bind:decimals={decimals1}
		updateCurrentInput={updateCurrent1}
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
		updateCurrentInput={updateCurrent2}
		on:tokenSelectedWithNumTokens={(e) => handleSelectionWithNumTokens()}
		on:tokenSelectedWithoutNumTokens={(e) => handleSelectionWithoutNumTokens()}
		on:tokenNumInputWithAddress={(e) => handleInputWithAddress(tokenBox2, e)}
		on:tokenNumInputWithoutAddress={() => handleInputWithoutAddress(tokenBox2)}
	/>
</div>
