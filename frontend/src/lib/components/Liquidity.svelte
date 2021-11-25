<script>
    import TokenBox from '$lib/components/sub/TokenBox.svelte'
    import TradeButton from '$lib/components/sub/TradeButton.svelte'
    import PoolInfo from '$lib/components/sub/PoolInfo.svelte'

    let name = "bsc";
</script>

<div class="box">
    <div class="title">Title</div>
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
	$box-radius: 20px;
	$box-background: rgb(61, 61, 61);

	.box {
		height: 500px;
		width: 500px;
		background: $box-background;

		border-radius: $box-radius;

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
