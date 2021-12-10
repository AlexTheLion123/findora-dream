<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	export let src = 'src/lib/assets/tokens/logos/eth_logo.svg';
	export let name: string;
    export let symbol: string;
    export let address: string;

	let item: HTMLDivElement;

	const dispatch = createEventDispatcher();
	function dispatchEvent(item: HTMLDivElement) {
        dispatch('tokenSelected', {
            element: item,
            src: src, 
            symbol: symbol,
            address: address
        })
    }
</script>

<div class="container" bind:this={item} on:click={() => dispatchEvent(item)}>
	<img {src} class="logo" width="35" height="35" alt="" />
	<p>{name}</p>
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		gap: 30px;

		height: 50px;
		padding-left: 20px;
	}

	.container:hover {
		cursor: pointer;
		background: rgb(255, 255, 255, 0.3);
	}
</style>
