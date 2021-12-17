<script lang="ts">
	import ExchangeHeader from '$lib/components/Exchange/Layout/ExchangeHeader.svelte';
	import Main from '$lib/components/Exchange/Liquidity/RemoveLiquidity/Main.svelte'

	import { page } from '$app/stores';
	const address = $page.params.address
</script>

<main>
	<header>
		<ExchangeHeader title="Remove Liquidity" showBack={true} path={'/exchange/liquidity'}/>
	</header>
	<Main {address}/>
</main>

<style>
	main {
		width: 500px;
	}

</style>