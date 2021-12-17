<script lang="ts">
	import ExchangeHeader from '$lib/components/Exchange/Layout/ExchangeHeader.svelte';
	import Main from '$lib/components/Exchange/Liquidity/AddLiquidity/Main.svelte'

</script>

<main>
	<header>
		<ExchangeHeader title="Add Liquidity" showBack={true} path={'/exchange/liquidity'}/>
	</header>
	<Main/>
</main>

<style>
	main {
		width: 500px;
	}

</style>