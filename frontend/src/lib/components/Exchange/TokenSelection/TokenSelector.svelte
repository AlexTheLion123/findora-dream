<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import TokenSearchDialog from './TokenSearchDialog.svelte';

	let showSearch = false; // bound to child
    let logoSrc: string;
    let symbol = "Select";

	const dispatch = createEventDispatcher();
	function handleSelection(e: any) {
		logoSrc = e.detail.src;
		symbol = e.detail.symbol;

		dispatch('tokenSelected', e.detail);
	}
	
</script>

<button on:click|preventDefault={() => (showSearch = true)}>
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
		width: 140px;
		height: 50px;
		padding: 15px 15px 15px 5px;

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
