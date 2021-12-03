<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let src = 'src/lib/assets/tokens/logos/eth_logo.svg';
	export let name;
    export let symbol;
    export let address;

	const dispatch = createEventDispatcher();
	function dispatchEvent() {
        dispatch('tokenSelected', {
            element: this,
            src: src, 
            symbol: symbol,
            address: address
        })
    }
</script>

<div class="container" on:click={dispatchEvent}>
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
