<script lang="ts">
	import ExchangeHeader from '$lib/components/Exchange/Layout/ExchangeHeader.svelte';
	import Positions from '$lib/components/Exchange/Liquidity/YourPositions/Positions.svelte';
	import ImportTokens from '$lib/components/Exchange/Liquidity/YourPositions/ImportTokens.svelte';
	import LinkBright from '$lib/components/Misc/LinkBright.svelte';
</script>

<main>
	<ExchangeHeader title="Your liquidity"/>
	<Positions />
	<div class="import">
		<ImportTokens />
	</div>
	<LinkBright text="Add liquidity" link="/exchange/liquidity/add" />
</main>

<style>
	main {
		width: 300px;
	}

	.import {
		margin: 20px 0;
	}
</style>
