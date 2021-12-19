<script lang="ts">
	import ExchangeHeader from '$lib/components/Exchange/Layout/ExchangeHeader.svelte';
	import Main from '$lib/components/Exchange/Swap/Main.svelte'

	let callSwap: () => Promise<void>;

	// TODO get address from params
	const address1 = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601';
	const address2 = '';
</script>

<main>
	<ExchangeHeader title="Swap" />
	<Main {address1} {address2}/>
</main>

<style lang="scss">
	main {
		width: 500px;
	}
</style>
