<script lang="ts">
	// TODO change this component to an inner box of the two tokens, so it will automatically work for
	// liquidity as well;

	import { getExactSwapData, getDollarValue, getRoute } from '$lib/scripts/Exchange/Swap';

	import type { Bytes32, Uint256, Uint32, Address } from 'soltypes';
	import { isProvided, router } from '$lib/stores';
	// import type { UniswapV2Router02} from '$lib/types/UniswapV2Router02';
	import TokenBox from './TokenBox.svelte';
	import TradeButton from './TradeButton.svelte';
	import RangeSlider from 'svelte-range-slider-pips';

	let token1Address: Address; // address
	let token2Address: Address; // address
	let numTokens1;
	let numTokens2;

	// Event handlers

	function handleSelection1(e) {
		token1Address = e.detail.address;

		if (token2Address) {
			// if other not selected, do nothing - since we only care about price within pool
			if (numTokens1 && numTokens2) {
				getExactSwapData(token1Address, token2Address);
			} else {
				getSwapRate(token1Address, token2Address);
			}
		}
	}
	function handleSelection2(e) {
		token2Address = e.detail.address;

		if (token1Address) {
			if (numTokens1 && numTokens2) {
				getExactSwapData(token1Address, token2Address);
			} else {
				getSwapRate(token1Address, token2Address);
			}
		}
	}

	function handleInput1(e) {
		console.log(e.detail.numTokens);
		// if (token1Address) {
		// 	// token 1 selected
		// 	getDollarValue(token1Address, numTokens1);

		// 	if (token2Address) {
		// 		// token 2 also selected
		// 		const route = getRoute(token1Address, token2Address);
		// 		numTokens2 = getExactSwapData(token1Address, token2Address, numTokens1, 0, route);
		// 		getDollarValue(token2Address, numTokens2);
		// 	}
		// }
	}

	function handleInput2(e) {
		console.log(e);
		// if (numTokens2) {
		// 	// will be updated every time numTokens2 updated

		// 	if (token2Address) {
		// 		// token 2 selected
		// 		getDollarValue(token2Address, numTokens2);

		// 		if (token1Address) {
		// 			const route = getRoute(token1Address, token2Address);
		// 			numTokens1 = getExactSwapData(token1Address, token2Address, 0, numTokens2, route);
		// 			getDollarValue(token1Address, numTokens1);
		// 		}
		// 	}
		// }
	}

	isProvided.subscribe((value) => {
		if (value) {
			// isProvided = true, then signed router contract exists
		}
	});
</script>

<form>
	<p class="title">Swap</p>

	<div id="token1">
		<TokenBox on:tokenSelected={handleSelection1} on:tokenNumInput={handleInput1} />
	</div>

	<div id="token2">
		<TokenBox on:tokenSelected={handleSelection2} on:tokenNumInput={handleInput2} />
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
			'. token1 token1 token1 token1 .' 3fr
			'. token2 token2 token2 token2 .' 3fr
			'. slider slider slider slider .' 3fr
			'. btn    btn    btn    btn    .' 2fr
			/ 2fr 3fr 3fr 3fr 3fr 2fr;

		.title {
			grid-area: title;
			align-self: center;
		}

		#token1 {
			grid-area: token1;
			height: 100%;
			width: 100%;
		}

		#token2 {
			grid-area: token2;
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
