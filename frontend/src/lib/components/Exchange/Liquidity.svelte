<script>
    import DoubleTokenBox from './DoubleTokenBox.svelte';
    import TradeButton from './TradeButton.svelte'
    import PoolInfo from './PoolInfo.svelte'

    let name1 = 'eth';
	let name2 = 'bsc';
	let balance1 = 100;
	let balance2 = 50;
	let dollars1 = '~ $4000';
	let dollars2 = '~ $3000';
	// exchange rate for tokens 1 and 2
	let value1 = 1;
	let value2 = 2;
    let logoSrc1 = "src/lib/assets/tokens/logos/eth_logo.svg";
	let logoSrc2 = "src/lib/assets/tokens/logos/bnb_logo.svg";
</script>

<div class="box">
    <p class="title">Liquidity</p>

    <div class="double-token-box">
        <DoubleTokenBox/>
    </div>

    <div class="pool-info">
        <PoolInfo/>
    </div>
    <div class="add-button">
        <TradeButton text="Add liquidity"/>
    </div>
</div>

<style lang="scss">
	$box-radius: 10px;
	$box-background: rgba(172, 172, 172, 0.1);
	$box-border: 1px solid rgba(255, 255, 255, 0.2);

    p {
		font-size: 25px;
	}

	.box {
		height: 500px;
		width: 500px;
		background: $box-background;

		border-radius: $box-radius;
        border: $box-border;

		display: grid;
		grid-template:
			'. title  ...... ...... ...... .' 1fr
			'. tokens tokens tokens tokens .' 3fr
			'. tokens tokens tokens tokens .' 3fr
			'. ...... ...... ...... ...... .' 0.5fr
			'. info   info   info   info   .' 3fr
			'. ...... ...... ...... ...... .' 0.5fr
			'. btn    btn    btn    btn    .' 2fr
			/ 2fr 3fr 3fr 3fr 3fr 2fr;

        .title {
            grid-area: title;
            align-self: center;
        }
        .double-token-box {
            grid-area: tokens;
        }
        .pool-info {
            grid-area: info;
        }
        .add-button {
            grid-area: btn;
        }
	}
</style>
