<script context="module">
	import { writable } from "svelte/store";
    const current = writable();
</script>

<script>
	export let src = 'src/lib/assets/tokens/logos/eth_logo.svg';
	export let name;

	let item;

	async function select() {
		$current = item;
	}
</script>

<div
	bind:this={item}
	class="container"
	on:click={select}
	class:selected={item===$current}
>
	<img {src} class="symbol" width="35" height="35" alt="" />
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

	.selected {
		background: rgb(255, 255, 255, 0.3);
	}
</style>
