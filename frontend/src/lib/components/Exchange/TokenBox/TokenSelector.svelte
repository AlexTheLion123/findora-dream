<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let editable: boolean; // TODO - don't allow hover on non-editable
	export let logo: string;
	export let symbol: string;

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch("showSearchDialog")
	}
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
