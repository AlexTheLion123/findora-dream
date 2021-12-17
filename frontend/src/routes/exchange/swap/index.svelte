<script lang="ts">
	import ExchangeHeader from '$lib/components/Exchange/Layout/ExchangeHeader.svelte';
	import Main from '$lib/components/Exchange/Swap/Main.svelte'

	let callSwap: () => Promise<void>;
</script>

<main>
	<ExchangeHeader title="Swap" />
	<Main/>
</main>

<style lang="scss">
	main {
		width: 500px;
	}
</style>
