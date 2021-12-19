<script lang="ts">
	import { createEventDispatcher, getContext, onMount } from 'svelte';
	import {getSymbol} from '$lib/scripts/exchange'
	import TokenSearchDialog from '../TokenSearchDialog/TokenSearchDialog.svelte';
	
	export let address: string = '';
	export let editable: boolean; // TODO - don't allow hover on non-editable
    let logo: string = "/src/lib/assets/tokens/logos/eth_logo.svg";
	let symbol: string = "Select";
	
	// TODO gets logo and symbol from address manually, don't export symbol or logo

	let showSearch = false; // bound to child

	const {signerObj} = getContext("exchange");
	const signer = signerObj.getSigner();

	const dispatch = createEventDispatcher();
	
	setNewSymbol();

	async function setNewSymbol() {
		if(address) {
			if(!symbol || symbol==="Select") {
				console.log("new symbol in place");
				symbol = await getSymbol(address, signer)
			}
			// TODO find way to get logo or default logo
		}
	}

	function handleSelection(e: any) {
		address = e.detail.address;

		if(e.detail.src) {
			logo = e.detail.src;
		} else {
			logo = "default"
		}

		if(e.detail.symbol) {
			symbol = e.detail.symbol;
		} else {
			setNewSymbol()
		}
		
		dispatch('tokenSelected', e.detail);
	}
	
</script>

<button on:click|preventDefault={() => (showSearch = true) } disabled={!editable}>
	<img src={logo} class="symbol" width="35" height="35" alt="" />
	<p>{symbol}</p>
	<i class="fas fa-chevron-down" />
</button>

{#if showSearch}
	<div class="popup-modal-wrapper">
		<TokenSearchDialog bind:isShown={showSearch} on:tokenSelected={handleSelection} />
	</div>
{/if}

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
