<svelte:options accessors={true} />

<script context="module" lang="ts">
	import { getBalance, getDecimals, formatNumber } from '$lib/scripts/exchange';
	import { removeDecimals } from '$lib/scripts/exchange/utils';
	import type {IExchangeContext} from '$lib/typesFrontend';
	
</script>

<script lang="ts">
	import TokenSelector from './TokenSelector.svelte';
	import NumTokenInput from './NumTokenInput.svelte';
	import { createEventDispatcher, getContext } from 'svelte';

	// get context
	const {
		signerObj,
		nativeToken,
		dollarsToken,
		getFactory,
		getRouter,
	}: IExchangeContext = getContext('exchange');

	const signer = signerObj.getSigner();
	const signerAddress = signerObj.getAddress();
	const nativeAddr = nativeToken.address;
	const dollarsAddr = dollarsToken.address
	const factory = getFactory();
	const router = getRouter();

	export let numTokens: number;
	export let address: string;
	export let decimals: number = 18;
	export let balance: number = 0;
	export let updateCurrentInput = true;

	const dispatch = createEventDispatcher();


	export async function updateBalance() {
		balance = removeDecimals(await getBalance(address, signer, signerAddress), decimals)
	}

	async function handleSelection(e: CustomEvent<any>) {
		if (typeof e.detail.address !== 'string') {
			alert('no address for selection');
			throw 'no address for selection';
		}

		address = e.detail.address;
		decimals = await getDecimals(e.detail.address, signer);
		balance = removeDecimals(await getBalance(e.detail.address, signer, signerAddress), decimals); // getBalance asynchronously then wait for decimals

		dispatch('tokenSelected', e.detail)
		if(numTokens) {
			dispatch('tokenSelectedWithNumTokens', e.detail);
		} else {
			dispatch('tokenSelectedWithoutNumTokens', e.detail)
		}
	}

	export async function handleInput() {
		/**
		 * Only dispatch event if same box's address exists
		 * numTokens is already bound to input
		*/

		if(address) {
			dispatch('tokenNumInputWithAddress');
		} else {
			dispatch('tokenNumInputWithoutAddress')
		}

	}
</script>

<div class="box">
	<div class="selector"><TokenSelector on:tokenSelected={handleSelection} /></div>
	<p class="balance">
		Balance: {formatNumber(balance, 5)}
	</p>
	<div class="input-component">
		<NumTokenInput bind:value={numTokens} updateCurrent={updateCurrentInput} on:tokenNumInput={handleInput} />
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
