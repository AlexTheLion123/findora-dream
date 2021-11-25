<script>
    // TODO change percent boxes to slider
	import TokenBox from './sub/TokenBox.svelte'
	import TradeButton from './sub/TradeButton.svelte'
    import RangeSlider from 'svelte-range-slider-pips';

	let name = "eth";
	let hue = [100];

	$: lightColor = `hsl(${Math.round(hue[0]) - 10}, 65%, 70%)`;
    $: color = `hsl(${Math.round(hue[0])}, 63%, 54%)`;

	let value1;
</script>

<form>
	<p class="title">Swap</p>

	<div id="token1">
		<TokenBox {name} bind:value={value1}/>
	</div>

	<div id="token2">
		<TokenBox {name}/>
	</div>
	
	<div class="slider-box" style="--range-handle-focus: {color}; --range-range: {lightColor}">
		<RangeSlider id="color-pips" bind:values={hue} 
      range="min" float
    />
	</div>

	<div class="swap-button">
		<TradeButton text="Swap" bind:color={color}/>
	</div>

</form>

<style lang="scss">
	$box-radius: 10px;
	$box-background: rgba(172, 172, 172, 0.1);
	$box-box-shadow: 0 25px 45px rgba(0,0,0,0.1);

	p {
		font-size: 25px;
		letter-spacing: 3px;
	}
	form {
		height: 500px;
		width: 500px;
		background: $box-background;

		border-radius: $box-radius;
		box-shadow: $box-box-shadow;
		border: 1px solid rgba(255,255,255,0.2);

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
		
		.token-box {
			display: flex;
            align-items: center;
			justify-content: space-between;
		}

		span {
			display: block;
		}
	}
</style>
