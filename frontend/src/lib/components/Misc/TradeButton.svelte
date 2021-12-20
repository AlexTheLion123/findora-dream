<script lang="ts">
	export let text: string;
	export let disabled = false;

	function formatText(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
</script>

<button on:click|preventDefault {disabled}>
	{#if text}{formatText(text)}{/if}
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
