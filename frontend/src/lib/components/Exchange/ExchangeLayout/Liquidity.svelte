<script lang="ts">
    import LiquidityBox from './LiquidityBox.svelte';
    import TradeButton from '../TradeButton.svelte'
    import PoolInfo from '../PoolInfo.svelte'
    import {signer, signerAddress} from '$lib/stores'

    
    let callLiquidity: () => Promise<void>

    export let liquidityReady = false;
</script>


{#if $signer && $signerAddress && liquidityReady}
    <div class="box">
        <p class="title">Liquidity</p>

        <div class="tokensAndInfoBox">
            <LiquidityBox bind:addLiquidity={callLiquidity}/>
        </div>
        <div class="add-button">
            <TradeButton text="Add liquidity" on:perfomAction={callLiquidity}/>
        </div>
    </div>
{:else}

    <div class="add-button">
        <TradeButton text="Connect to metamask"/>
    </div>

{/if}


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
			'. tokens tokens tokens tokens .' 0.5fr
			'. tokens tokens tokens tokens .' 3fr
			'. ...... ...... ...... ...... .' 0.5fr
			'. btn    btn    btn    btn    .' 2fr
			/ 2fr 3fr 3fr 3fr 3fr 2fr;

        .title {
            grid-area: title;
            align-self: center;
        }
        .tokensAndInfoBox {
            grid-area: tokens;
        }
    
        .add-button {
            grid-area: btn;
        }
	}
</style>
