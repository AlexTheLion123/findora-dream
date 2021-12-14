<script lang="ts">
	import SwapBox from './SwapBox.svelte';
	import TradeButton from '../TradeButton.svelte';
	import RangeSlider from 'svelte-range-slider-pips';

	import {signer, signerAddress} from '$lib/stores';

	let callSwap: () => Promise<void>

	export let swapReady = false;

	console.log("lsdkfjslfkj")
</script>


{#if swapReady && $signer && $signerAddress}

	<form>
		<p class="title">Swap</p>

		<div class="double-token-box">
			<SwapBox bind:action={callSwap}/>
		</div>

		<div class="slider-box">
			<RangeSlider id="color-pips" range="min" float pips step={5} />
		</div>

		<div class="swap-button">
			<TradeButton text="Swap" on:perfomAction={callSwap}/>
		</div>
	</form>

{:else}

	<div class="swap-button">
		<TradeButton text="Connect to metamask" on:perfomAction={() => alert("connect to metamask")}/>
	</div>
	
{/if}

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
