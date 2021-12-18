<svelte:options accessors={true} />

<script context="module" lang="ts">
	import { getBalance, getDecimals, formatNumber } from '$lib/scripts/exchange';
	import { removeDecimals } from '$lib/scripts/exchange/utils';
	import type { IExchangeContext } from '$lib/typesFrontend';
</script>

<script lang="ts">
	import TokenSelector from './TokenSelector.svelte';
	import NumTokenInput from './NumTokenInput.svelte';
	import { createEventDispatcher, getContext, onMount } from 'svelte';

	// get context
	const { signerObj }: IExchangeContext = getContext('exchange');
	const signer = signerObj.getSigner();
	const signerAddress = signerObj.getAddress();

	// all you need to supply in parent to set default is address

	export let address: string = '';
	export let numTokens: number = 0;
	export let decimals: number = 0;
	export let balance: number = 0;
	export let editable = true;
	export let updateCurrentInput = true;
	export let logoSrc: string = "/src/lib/assets/tokens/logos/eth_logo.svg";
	export let symbol: string = "Select";
	
	const dispatch = createEventDispatcher();

	initialize();


	export async function updateBalance() {
		// TODO use
		balance = removeDecimals(await getBalance(address, signer, signerAddress), decimals);
	}

	async function handleSelection(e: CustomEvent<any>) {
		if (typeof e.detail.address !== 'string') {
			alert('no address for selection');
			throw 'no address for selection';
		}

		address = e.detail.address;
		decimals = await getDecimals(e.detail.address, signer);
		balance = removeDecimals(await getBalance(e.detail.address, signer, signerAddress), decimals); // getBalance asynchronously then wait for decimals

		dispatch('tokenSelected', e.detail);
		if (numTokens) {
			dispatch('tokenSelectedWithNumTokens', e.detail);
		} else {
			dispatch('tokenSelectedWithoutNumTokens', e.detail);
		}
	}

	export async function handleInput() {
		// TODO use
		/**
		 * Only dispatch event if same box's address exists
		 * numTokens is already bound to input
		 */

		if (address) {
			dispatch('tokenNumInputWithAddress');
		} else {
			dispatch('tokenNumInputWithoutAddress');
		}
	}


	async function initialize() {
		if (address) {
			if (!decimals) {
				decimals = await getDecimals(address, signer);
			}

			if (!balance) {
				balance = removeDecimals(await getBalance(address, signer, signerAddress), decimals)
			}
		}
	}

</script>

<div class="box">
	<div class="selector">
		<TokenSelector on:tokenSelected={handleSelection} {editable} {symbol} {logoSrc} {address}/>
	</div>
	<p class="balance">
		Balance: {formatNumber(balance, 5)}
	</p>
	<div class="input-component">
		<NumTokenInput
			bind:value={numTokens}
			updateCurrent={updateCurrentInput}
			on:tokenNumInput={handleInput}
		/>
	</div>
	<!-- <p class="dollars">
		~$ {formatNumber(dollars, 2)}
	</p> -->
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
			'selector input input' 1fr
			'balance balance .' 1fr / 1fr 2fr;
		align-items: center;
	}

	.selector {
		grid-area: selector;
	}

	.balance {
		grid-area: balance;
		letter-spacing: 0.76px;
	}

	.input-component {
		grid-area: input;
		justify-self: end;
	}

	// .dollars {
	// 	grid-area: dollars;
	// 	justify-self: end;
	// }
</style>
