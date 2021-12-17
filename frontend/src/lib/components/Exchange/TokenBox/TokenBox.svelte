<svelte:options accessors={true} />

<script context="module" lang="ts">
	import { getBalance, getDecimals, formatNumber, getSymbol } from '$lib/scripts/exchange';
	import { removeDecimals } from '$lib/scripts/exchange/utils';
	import type { IExchangeContext } from '$lib/typesFrontend';
</script>

<script lang="ts">
	import TokenSelector from './TokenSelector.svelte';
	import NumTokenInput from './NumTokenInput.svelte';
	import { createEventDispatcher, getContext } from 'svelte';

	// get context
	const { signerObj }: IExchangeContext = getContext('exchange');
	const signer = signerObj.getSigner();
	const signerAddress = signerObj.getAddress();

	// all you need to supply in parent to set default is address

	export let address: string;
	export let numTokens: number = 0;
	export let decimals: number = 0;
	export let balance: number = 0;
	export let editable = true;
	export let updateCurrentInput = true;
	export let symbol = "";
	export let logoSrc = "/src/lib/assets/tokens/logos/eth_logo.svg"

	const dispatch = createEventDispatcher();

	export async function updateBalance() { // TODO use
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

	export async function handleInput() { // TODO use
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

	function initialize(node: HTMLDivElement) {
		if(address) {
			console.log("initializing", address);

			if(!symbol) {
				getSymbol(address, signer)
				.then(_symbol => {
					symbol = _symbol ? _symbol : "Select"
				});
			}

			if(!decimals) {
				getDecimals(address, signer)
				.then(_decimals => {
					decimals = _decimals
					
					if(!balance) {
						getBalance(address, signer, signerAddress)
						.then(_balance => {
							balance = removeDecimals(_balance, decimals)
						})
					}
				})
			}
		}

	}
</script>

<div class="box" use:initialize>
	<div class="selector"><TokenSelector on:tokenSelected={handleSelection} {editable} {symbol} {logoSrc}/></div>
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
