<script context="module" lang="ts">
	import { ethers, providers } from 'ethers';
</script>

<script>
	import { isProvided, router } from '$lib/stores';
	// import type { UniswapV2Router02} from '$lib/types/UniswapV2Router02';
	import TokenBox from './TokenBox.svelte';
	import TradeButton from './TradeButton.svelte';
	import RangeSlider from 'svelte-range-slider-pips';

	let numTokens1;
	let numTokens2;

	isProvided.subscribe((value) => {
		if (value) {
			// isProvided = true, then signed router contract exists
			
			
		}
	});

	function handleSelection1(e) {
		if(numTokens1) {
			console.log('hello1')
		} else {
			console.log("bye2");
			
		}
	}
	function handleSelection2(e) {
		if(numTokens2) {
			console.log('hello1')
		} else {
			console.log("bye2");
			
		}
	}
</script>

<form>
	<p class="title">Swap</p>

	<div id="token1">
		<TokenBox bind:numTokens={numTokens1} on:tokenSelected={handleSelection1}/>
	</div>

	<div id="token2">
		<TokenBox bind:numTokens={numTokens2} on:tokenSelected={handleSelection2}/>
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
