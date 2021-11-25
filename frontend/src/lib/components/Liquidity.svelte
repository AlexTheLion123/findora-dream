<script>
    import TokenBox from '$lib/components/sub/TokenBox.svelte'
    import TradeButton from '$lib/components/sub/TradeButton.svelte'
    import PoolInfo from '$lib/components/sub/PoolInfo.svelte'

    let name = "bsc";

    
</script>

<div class="box">
    <div class="title">Liquidity</div>
    <div id="token1">
        <TokenBox {name}/>
    </div>
    <div id="token2">
        <TokenBox {name}/>
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
	$box-box-shadow: 0 25px 45px rgba(0,0,0,0.1);

	.box {
		height: 500px;
		width: 500px;
		background: $box-background;

		border-radius: $box-radius;
		box-shadow: $box-box-shadow;

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
