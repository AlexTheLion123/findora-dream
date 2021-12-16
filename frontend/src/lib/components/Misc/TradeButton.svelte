<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';


	export let text: string;

	const dispatch = createEventDispatcher();

</script>

<button on:click|preventDefault>
	{text}
</button>

<style lang="scss">
	$background: linear-gradient(to right, rgb(251, 255, 0), rgb(255, 102, 0), rgb(255, 0, 255));

	button {
		display: grid;
		place-items: center;

		height: 50px;
		width: 100%;
		background: $background;

		border-radius: 10px;

		&:hover {
			cursor: pointer;
		}
	}
</style>
