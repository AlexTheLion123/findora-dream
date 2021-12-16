<script lang="ts">
    import TradeButton from '$lib/components/Misc/TradeButton.svelte';
	import ExchangeHeader from '$lib/components/Exchange/Layout/ExchangeHeader.svelte';
	import TripleTokenBox from '$lib/components/Exchange/Liquidity/AddLiquidity/TripleTokenBox.svelte'

	let callAdd: () => Promise<void>;

</script>

<main>
	<header>
		<ExchangeHeader title="Add Liquidity" showBack={true} path={'/exchange/liquidity'}/>
	</header>
	<div class="double-token-box">
		<TripleTokenBox bind:addLiquidity={callAdd}/>
	</div>
	<div class="button">
		<TradeButton text="Add liquidity" on:click={callAdd} />
	</div>
</main>

