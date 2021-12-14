<script lang="ts">
	import {formatNumber} from '$lib/scripts/exchange'

	export let rate: number = 0;
	export let share: number = 0;
	export let symbol1 = "";
	export let symbol2 = "";
</script>

<div class="box">
	<header>Prices and Pool Share</header>
	<div class="info">
		<article>
			<p class="rate1">{formatNumber(rate, 6)}</p>
			<span>{symbol2} per {symbol1}</span>
		</article>
		<p class="pool-share">{formatNumber(share, 4)}%</p>
	</div>
</div>

<style lang="scss">
	$box-background: rgba(255, 255, 255, 0.068);

	.box {
		height: 100%;
		width: 100%;
		header {
			display: flex;
			align-items: center;
		}

		.info {
			height: 100%;
			margin-top: 5px;
			background: $box-background;
			border-radius: 8px;
			display: flex;
			align-items: center;
			justify-content: space-around;
		}
	}
</style>
