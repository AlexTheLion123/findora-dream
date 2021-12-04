<script lang="ts">
	// TODO change this component to an inner box of the two tokens, so it will automatically work for
	// liquidity as well;

	
	import { isProvided, router } from '$lib/stores';
	// import type { UniswapV2Router02} from '$lib/types/UniswapV2Router02';

	import DoubleTokenBox from './DoubleTokenBox.svelte';
	import TradeButton from './TradeButton.svelte';
	import RangeSlider from 'svelte-range-slider-pips';

	isProvided.subscribe((value) => {
		if (value) {
			// isProvided = true, then signed router contract exists
		}
	});
</script>

<form>
	<p class="title">Swap</p>

	<div class="double-token-box">
		<DoubleTokenBox/>
	</div>

	<div class="slider-box">
		<RangeSlider id="color-pips" range="min" float pips step={5} />
	</div>

	<div class="swap-button">
		<TradeButton text="Swap" />
	</div>
</form>

<style lang="scss">
	$box-radius: 10px;
	$box-background: rgba(172, 172, 172, 0.1);
	$box-border: 1px solid rgba(255, 255, 255, 0.2);

	p {
		font-size: 25px;
	}
	form {
		height: 500px;
		width: 500px;
		background: $box-background;

		border-radius: $box-radius;
		border: $box-border;

		display: grid;
		grid-template:
			'. title  ...... ...... ...... .' 2fr
			'. tokens tokens tokens tokens .' 3fr
			'. tokens tokens tokens tokens .' 3fr
			'. slider slider slider slider .' 3fr
			'. btn    btn    btn    btn    .' 2fr
			/ 2fr 3fr 3fr 3fr 3fr 2fr;

		.title {
			grid-area: title;
			align-self: center;
		}

		.double-token-box {
			grid-area: tokens;
		}

		.slider-box {
			grid-area: slider;
			position: relative;
			align-self: center;
		}

		.swap-button {
			grid-area: btn;
		}
	}
</style>
