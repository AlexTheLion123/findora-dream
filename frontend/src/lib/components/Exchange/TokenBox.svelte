<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import TokenSelector from "./TokenSelector.svelte";

	export let numTokens;
	let balance = 0.00;
	let dollars = 0.00;
	let dollarRate;
	
	$: if(numTokens && dollarRate) {
		dollars = numTokens * dollarRate;
	}

	const dispatch = createEventDispatcher();
	function handleSelection(e) {
		updateBox(e.detail.address);
		dispatch('tokenSelected', e);
	}

	// TODO fix all these functions, currently mocks
	function updateBox(address: string) {
		balance = getBalance(address);
		dollars = getDollarValue(numTokens, address);
	}

	function getBalance(address: string) {
		console.log("get data", address)
		return 100;
	}

	function getDollarValue(_numTokens: number, _address: string) {
		dollarRate = getDollarExchangeRate(_address);
		return _numTokens * dollarRate;
	}

	function getDollarExchangeRate(_address: string) {
		return 20;
	}
</script>

<div class="box">
		<div class="selector"><TokenSelector on:tokenSelected={handleSelection}/></div>
		<p class="balance">Balance: {balance}</p>
		<input type="number" bind:value={numTokens} placeholder="0.00" />
		<p class="dollars">{dollars}</p>
	</div>

<style lang="scss">
	$background: none;
	$radius: 10px;
	$border: 1px solid rgba(255, 255, 255, 0.1);

	.box {
		background: $background;
		width: 100%;
		height: 100%;
		border: $border;
		padding: 10px 5px;
		border-radius: $radius;

		display: grid;
		grid-template:
		"selector value" 1fr
		"balance dollars" 1fr / 1fr 1fr;
		align-items: center;
	}

	.selector {
		grid-area: selector;
	}

	.balance {
		grid-area: balance;
	}

	input {
		all: unset;
		font-size: 30px;
		color: white;
		text-align: right;
		overflow: hidden;
		max-width: 70%;

		grid-area: value;
		justify-self: end;
	}

	.dollars {
		grid-area: dollars;
		justify-self: end;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
        all: unset;
	}

	input[type='number'] {
		-moz-appearance: textfield; /* Firefox */
	}
</style>
