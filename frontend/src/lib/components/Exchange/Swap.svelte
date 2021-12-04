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
	let numTokens1: number;
	let numTokens2: number;
	let dollars1 = 0.0;
	let dollars2 = 0.0;

	/**
	 * Event handlers
	 * There are four events:
	 * 1. Token 1 selected
	 * 2. Token 2 selected
	 * 3. Token 1 input
	 * 4. Token 2 input
	 *
	 */

	async function handleSelection1(e) {
		token1Address = e.detail.address;
		console.log(token1Address);

		if (numTokens1) {
			// need to work out dolars again since different token
			dollars1 = await getDollarValue(token1Address, numTokens1); // TODO remove await, can handle async

			if (token2Address) {
				// no need to work out dollars again for token 2 since would have been calculated already and nothing changed
				const route = await getRoute(token1Address, token2Address);
				numTokens2 = await getExactSwapData(token1Address, token2Address, numTokens1, 0, route);
			}
		} else if (token2Address && numTokens2) {
			// no point in getting route separately if no inputs but both selected
			const route = await getRoute(token1Address, token2Address);
			numTokens1 = await getExactSwapData(token1Address, token2Address, 0, numTokens2, route);
		}
	}

	async function handleSelection2(e) {
		token2Address = e.detail.address;
		console.log(token2Address);

		if (numTokens2) {
			// need to work out dolars again since different token
			dollars2 = await getDollarValue(token2Address, numTokens2); // TODO remove await, can handle async

			if (token1Address) {
				// no need to work out dollars again for token 2 since would have been calculated already and nothing changed
				const route = await getRoute(token1Address, token2Address);
				numTokens1 = await getExactSwapData(token1Address, token2Address, 0, numTokens2, route);
			}
		} else if (token1Address && numTokens1) {
			// no point in getting route separately if no inputs but both selected
			const route = await getRoute(token1Address, token2Address);
			numTokens2 = await getExactSwapData(token1Address, token2Address, numTokens1, 0, route);
		}
	}

	async function handleInput1(e) {
		numTokens1 = e.detail.numTokens;
		console.log(numTokens1);

		if (token1Address) {
			// token 1 selected
			dollars1 = await getDollarValue(token1Address, numTokens1);

			if (token2Address) {
				// token 2 also selected, then we can go ahead and get all data
				const route = await getRoute(token1Address, token2Address);
				numTokens2 = await getExactSwapData(token1Address, token2Address, numTokens1, 0, route);
				dollars2 = await getDollarValue(token2Address, numTokens2);
			}
		}

		// we don't care if only token2 is selected this is handled by token2 selection event
		// And of course, we also don't care if neither are selected.
	}

	async function handleInput2(e) {
		numTokens2 = e.detail.numTokens;
		console.log(numTokens2);

		if (token2Address) {
			// token 2 selected, otherwise can't do anything
			dollars2 = await getDollarValue(token2Address, numTokens2);

			if (token1Address) {
				const route = await getRoute(token1Address, token2Address);
				numTokens1 = await getExactSwapData(token1Address, token2Address, 0, numTokens2, route);
				dollars1 = await getDollarValue(token1Address, numTokens1);
			}
		}
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
		<TokenBox
			on:tokenSelected={handleSelection1}
			on:tokenNumInput={handleInput1}
			dollars={dollars1}
			numTokens={numTokens1}
		/>
	</div>

	<div id="token2">
		<TokenBox
			on:tokenSelected={handleSelection2}
			on:tokenNumInput={handleInput2}
			dollars={dollars2}
			numTokens={numTokens2}
		/>
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
