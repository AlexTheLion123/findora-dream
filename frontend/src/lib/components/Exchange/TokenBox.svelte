<script context="module" lang="ts">
	export let currentInputElement: HTMLInputElement; // is used, not sure why showing problem
	import { getBalance } from '$lib/scripts/Exchange/ExchangeQueries';
	import { createEventDispatcher } from 'svelte';
	import { signer} from '$lib/stores'
	import type { JsonRpcSigner} from '@ethersproject/providers'

	let signer_val: null | JsonRpcSigner;
	signer.subscribe(value => signer_val = value)
</script>

<script lang="ts">
	import TokenSelector from './TokenSelector.svelte';
	import { ProviderError } from '$lib/scripts/Exchange/Errors';

	let inputElement: HTMLInputElement;
	export let dollars: number;
	export let numTokens: number;
	export let balance: number = 0.00;
	let inputEventDispatchBuffer = 1000; // i.e. only dispatch input event every 2 seconds (2000 milliseconds)

	// events
	const dispatch = createEventDispatcher();
	async function handleSelection(e: any) {
		// TODO use shortcut
		dispatch('tokenSelected', e.detail);

		if(!signer_val) { // TODO throw proper error
			alert("Connect to metmask") 
			return
		}

		balance = await getBalance(e.detail.address, signer_val);
	}
	/**
	 * @dev input event is dispatched on every key stroke, which is far too often to be querying blockchain every time.
	 * Instead, only dispatch every 2 seconds.
	 */
	const handleInput = (function () {
		let isTimeout = false;

		return function (event: any) {
			updateCurrentInputElement();

			if (isTimeout == true) {
				return;
			}

			/**
			 * If called too soon after the last call, checks if there is an event waiting to be dispatched in settimeout
			 * If not, settimeout is set and function is locked so nothing happens until settimeout dispatched
			 * settimeout should be dispatched with latest value
			 */

			isTimeout = true;
			setTimeout(() => {
				dispatch('tokenNumInput', { numTokens: numTokens });
				isTimeout = false;
			}, inputEventDispatchBuffer);
		};
	})();

	function updateCurrentInputElement() {
		if (currentInputElement && currentInputElement !== inputElement) {
			currentInputElement.value = '';
		}
		currentInputElement = inputElement;
	}

	function formatNumber(num: number | string, decimals: number) {
		if (typeof num === 'string') {
			return Math.round(parseInt(num) * 10 ** decimals) / 10 ** decimals;
		}
		return Math.round(num * 10 ** decimals) / 10 ** decimals;
	}
</script>

<div class="box">
	<div class="selector"><TokenSelector on:tokenSelected={handleSelection} /></div>
	<p class="balance">Balance: {formatNumber(balance, 4)}</p>
	<input
		type="number"
		bind:value={numTokens}
		bind:this={inputElement}
		placeholder="0.00"
		on:input={handleInput}
	/>
	<p class="dollars">~$ {formatNumber(dollars, 2)}</p>
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
			'selector input' 1fr
			'balance dollars' 1fr / 1fr 2fr;
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
		max-width: 95%;
		grid-area: input;
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
