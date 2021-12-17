<script lang="ts">
	import { createEventDispatcher, getContext } from 'svelte';
	import {getSymbol} from '$lib/scripts/exchange'
	import TokenSearchDialog from '../TokenSearchDialog/TokenSearchDialog.svelte';
	
	export let address: string;
	export let editable: boolean = true; // TODO - don't allow hover on non-editable
    export let logoSrc: string = "";
	export let symbol: string = "Select";
	
	let showSearch = false; // bound to child

	const {signerObj} = getContext("exchange");
	const signer = signerObj.getSigner();

	function initialize(node: HTMLButtonElement) {
		if(address) {
			if(!symbol) {
				getSymbol(address, signer)
				.then(_symbol => symbol = _symbol)
			}

			// TODO find way to get logo or default logo
		}
	}

	const dispatch = createEventDispatcher();
	function handleSelection(e: any) {
		address = e.detail.address;

		if(e.detail.src) {
			logoSrc = e.detail.src;
		} else {
			logoSrc = "default"
		}

		if(e.detail.symbol) {
			symbol = e.detail.symbol;
		} else {
			getSymbol(e.detail.address, signer) // can do async
			.then(_symbol => symbol = _symbol)
		}
		
		dispatch('tokenSelected', e.detail);
	}
	
</script>

<button on:click|preventDefault={() => (showSearch = true) } disabled={!editable} use:initialize>
	<img src={logoSrc} class="symbol" width="35" height="35" alt="" />
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
