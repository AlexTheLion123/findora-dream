<script lang="ts">
	import TradeButton from '$lib/components/Misc/TradeButton.svelte';
	import RangeSlider from 'svelte-range-slider-pips';
	import ExchangeHeader from '$lib/components/Exchange/Layout/ExchangeHeader.svelte';
	import SwapTokenBox from '$lib/components/Exchange/Swap/SwapTokenBox.svelte';

	let callSwap: () => Promise<void>;
</script>

<main>
	<ExchangeHeader title="Swap" />
	<SwapTokenBox />
	<RangeSlider id="color-pips" range="min" float pips step={5} />
	<TradeButton text="Swap" on:click={callSwap} />
</main>

<style lang="scss">
	main {
		width: 500px;
	}
</style>
