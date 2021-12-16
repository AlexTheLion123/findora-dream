<script lang="ts">
	import AddLiquidityBox from './AddLiquidityBox.svelte';
	import TradeButton from '../TradeButton.svelte';
	import PoolInfo from '../PoolInfo.svelte';
	import { signer, signerAddress } from '$lib/stores';

	let callLiquidity: () => Promise<void>;

	export let liquidityReady = false;
</script>

{#if $signer && $signerAddress && liquidityReady}
	<div class="box">

        <header>
            <i class="fas fa-arrow-left" />
            <p class="title">Add Liquidity</p>
            <div class="placeholder"></div>
        </header>

		<div class="tokensAndInfoBox">
			<AddLiquidityBox bind:addLiquidity={callLiquidity} />
		</div>
		<div class="add-button">
			<TradeButton text="Add liquidity" on:perfomAction={callLiquidity} />
		</div>
	</div>
{:else}
	<div class="add-button">
		<TradeButton text="Connect to metamask" />
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
		height: 550px;
		width: 500px;
		background: $box-background;

		border-radius: $box-radius;
		border: $box-border;

		display: grid;

		grid-template:
			'. header header header header .' 1.5fr
			'. tokens tokens tokens tokens .' 3fr
			'. tokens tokens tokens tokens .' 3fr
			'. tokens tokens tokens tokens .' 0.5fr
			'. tokens tokens tokens tokens .' 3fr
			'. ...... ...... ...... ...... .' 0.5fr
			'. btn    btn    btn    btn    .' 2fr
			/ 2fr 3fr 3fr 3fr 3fr 2fr;


        header {
            grid-area: header;
            display: flex;
            align-items: center;

            display: flex;
            justify-content: space-between;

        }

		.tokensAndInfoBox {
			grid-area: tokens;
		}

		.add-button {
			grid-area: btn;
		}
	}

    i {
        &:hover{
            cursor: pointer;
        }    
    }
</style>
