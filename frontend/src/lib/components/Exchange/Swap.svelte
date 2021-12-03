<script context="module" lang="ts">
	import { ethers, providers } from 'ethers';
</script>

<script lang="ts">
	import { isProvided, router } from '$lib/stores';
	// import type { UniswapV2Router02} from '$lib/types/UniswapV2Router02';
	import TokenBox from './TokenBox.svelte';
	import TradeButton from './TradeButton.svelte';
	import RangeSlider from 'svelte-range-slider-pips';

	let token1Address; // address
	let token2Address; // address
	let numTokens1;
	let numTokens2;

	let rate;

	isProvided.subscribe((value) => {
		if (value) {
			// isProvided = true, then signed router contract exists
			
			
		}
	});


	$: if(numTokens1) {
		// will be updated every time numTokens1 updated

		if(token1Address && token2Address) {
			if(numTokens2) {
				getExactSwapData(token1Address, token2Address);
			} else {
				getSwapRate(token1Address, token2Address);
			}
		}
	}

	$: if(numTokens2) {
		// will be updated every time numTokens2 updated

		if(token2Address && token1Address) {
			if(numTokens2) {
				getExactSwapData(token1Address, token2Address);
			} else {
				getSwapRate(token1Address, token2Address);
			}
		}
	}


	function handleSelection1(e) {
		token1Address = e.detail.address;
		
		if(token2Address) {
			// if other not selected, do nothing - since we only care about price within pool
			if(numTokens1 && numTokens2) {
				getExactSwapData(token1Address, token2Address)
				
			} else {
				getSwapRate(token1Address, token2Address);
			}
		}
	}
	function handleSelection2(e) {
		token2Address = e.detail.address;

		if(token1Address) {
			if(numTokens1 && numTokens2) {
				getExactSwapData(token1Address, token2Address);
			} else {
				getSwapRate(token1Address, token2Address);
			}
		}
	}

	async function getExactSwapData(token1Address, token2Address) {
		let exists = await checkPairExists(token1Address, token2Address);

		if(exists) {
			// swap
		} else {
			// create pair
		}
	}
	async function checkPairExists(token1Address, token2Address){
		return true; // query blockchain
	}
	function getSwapRate(token1Address, token2Address) {

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
