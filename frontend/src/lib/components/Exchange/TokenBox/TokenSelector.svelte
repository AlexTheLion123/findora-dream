<script context="module" lang="ts">
	import { getSymbol } from '$lib/scripts/exchange';
	import type { IExchangeContext } from '$lib/typesFrontend';
</script>

<script lang="ts">
	import { createEventDispatcher, getContext, onMount } from 'svelte';
	
	export let address: string; // address needed to set default
	export let editable: boolean; // TODO - don't allow hover on non-editable
	export let logo: string;
	export let symbol: string;

	const {signerObj}: IExchangeContext = getContext("exchange")
	const signer = signerObj.getSigner();

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch("showSearchDialog")
	}

	onMount(async () => {
		if(address) {
			symbol = await getSymbol(address, signer)
			logo = '/src/lib/assets/svg/eth_logo.svg'
			// TODO get logo from symbol
		} else {
			symbol = "Select"
		}
	})

</script>

<button on:click|preventDefault={handleClick} disabled={!editable}>
	<img src={logo} class="symbol" width="35" height="35" alt="" />
	<p>{symbol}</p>
	<i class="fas fa-chevron-down" />
</button>



<style>
	button {
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 20px;
		height: 50px;
		padding: 15px 15px 15px 5px;

		width: 100%;

		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	button:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.symbol {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 100%;
		box-sizing: content-box;
		padding: 5px;
	}
</style>
