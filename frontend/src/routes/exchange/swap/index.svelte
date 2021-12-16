<script lang="ts">
	import DoubleTokenBox from '$lib/components/Exchange/Swap/DoubleTokenBox.svelte';
	import TradeButton from '$lib/components/Misc/TradeButton.svelte';
	import RangeSlider from 'svelte-range-slider-pips';
	import ExchangeHeader from '$lib/components/Exchange/Layout/ExchangeHeader.svelte';

	let callSwap: () => Promise<void>

</script>


<main>
	<header>
		<ExchangeHeader title="Swap"/>
	</header>
	<div class="double-token-box">
		<DoubleTokenBox bind:action={callSwap}/>
	</div>

	<div class="slider-box">
		<RangeSlider id="color-pips" range="min" float pips step={5} />
	</div>

	<div class="swap-button">
		<TradeButton text="Swap" on:perfomAction={callSwap}/>
	</div>
</main>


<style lang="scss">
	main {
		width: 500px;		
	}
</style>