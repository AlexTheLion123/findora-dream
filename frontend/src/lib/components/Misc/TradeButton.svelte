<script lang="ts">
	export let text: string;
	export let disabled = false;

	function formatIfApprove(str: string) {
		if (str.toLowerCase().includes('approve')) {
			const arr = str.split(' ');
			return arr[0] + ' ' + arr[1];
		}
		return str;
	}

	function formatText(str: string) {
		const temp = formatIfApprove(str)
		return temp.charAt(0).toUpperCase() + temp.slice(1);
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
