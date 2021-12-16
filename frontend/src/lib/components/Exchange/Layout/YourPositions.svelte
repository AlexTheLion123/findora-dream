<script lang="ts">
	import TradeButton from '../TradeButton.svelte';

	export let showAddLiquidity: boolean;

    $: console.log(showAddLiquidity)

    const filter = {

    }
</script>

<div class="box">
	<header>
		<p>Your liquidity</p>
	</header>
	<div class="positions">Positions</div>
	<TradeButton text="Add Liquidity" on:perfomAction={() => showAddLiquidity = true} />
</div>

<style lang="scss">
	$box-radius: 10px;
	$box-background: rgba(172, 172, 172, 0.1);
	$box-border: 1px solid rgba(255, 255, 255, 0.2);

	.box {
		height: 400px;
		width: 400px;
        padding: 10px 20px;
		background: $box-background;

		border-radius: $box-radius;
		border: $box-border;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
	}

	header {
		display: flex;
		justify-content: center;
	}

	.positions {
        background: black;
        height: 100%;
        margin: 10px 0;
	}
</style>
