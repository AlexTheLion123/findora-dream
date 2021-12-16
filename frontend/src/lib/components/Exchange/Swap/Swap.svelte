<script lang="ts">
	import SwapBox from './SwapBox.svelte';
	import TradeButton from '../TradeButton.svelte';
	import RangeSlider from 'svelte-range-slider-pips';


	let callSwap: () => Promise<void>

</script>


<main>
	<div class="double-token-box">
		<SwapBox bind:action={callSwap}/>
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
