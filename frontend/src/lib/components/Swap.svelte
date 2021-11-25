<script>
    // TODO change percent boxes to slider
	import TokenBox from './sub/TokenBox.svelte'
	import TradeButton from './sub/TradeButton.svelte'
	import PercentButton from './sub/PercentButton.svelte'

	let name = "eth"
</script>

<div class="box">
	<div class="title">Swap</div>

	<div id="token1">
		<TokenBox {name}/>
	</div>

	<div id="token2">
		<TokenBox {name}/>
	</div>
	
	<div class="pbox">
		<PercentButton text="25%"/>
		<PercentButton text="50%"/>
		<PercentButton text="75%"/>
		<PercentButton text="100%"/>
	</div>

	<div class="swap-button">
		<TradeButton text="Swap"/>
	</div>

</div>

<style lang="scss">
	$box-radius: 20px;

	.box {
		height: 500px;
		width: 500px;
		background: rgb(61, 61, 61);

		border-radius: $box-radius;

		display: grid;
		grid-template:
			'. title  ...... ...... ...... .' 1fr
			'. token1 token1 token1 token1 .' 3fr
			'. token2 token2 token2 token2 .' 3fr
			'. pbox   pbox   pbox   pbox   .' 2fr
			'. btn    btn    btn    btn    .' 2fr
			/ 2fr 3fr 3fr 3fr 3fr 2fr;

		.title {
			grid-area: title;

			align-self: center;
		}

		#token1 {
			grid-area: token1;
		}

		#token2 {
			grid-area: token2;
		}

		.pbox {
			grid-area: pbox;

			display: flex;
			justify-content: space-around;
			align-items: center;
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
