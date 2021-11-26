<script>
    import TokenBox from '$lib/components/sub/TokenBox.svelte'
    import TradeButton from '$lib/components/sub/TradeButton.svelte'
    import PoolInfo from '$lib/components/sub/PoolInfo.svelte'

    let name1 = 'eth';
	let name2 = 'bsc';
	let balance1 = 100;
	let balance2 = 50;
	let dollars1 = '~ $4000';
	let dollars2 = '~ $3000';
	// exchange rate for tokens 1 and 2
	let value1 = 1;
	let value2 = 2;
</script>

<div class="box">
    <p class="title">Liquidity</p>
    <div id="token1">
        <TokenBox name={name1} bind:value={value1} balance={balance1} dollars={dollars1}/>

    </div>
    <div id="token2">
        <TokenBox name={name2} bind:value={value2} balance={balance2} dollars={dollars2}/>

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
			'. token1 token1 token1 token1 .' 3fr
			'. token2 token2 token2 token2 .' 3fr
			'. ...... ...... ...... ...... .' 0.5fr
			'. info   info   info   info   .' 3fr
			'. ...... ...... ...... ...... .' 0.5fr
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
        .pool-info {
            grid-area: info;
        }
        .add-button {
            grid-area: btn;
        }
	}
</style>
