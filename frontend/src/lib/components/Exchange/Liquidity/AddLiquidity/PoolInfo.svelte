<script lang="ts">
	import CreateMessage from './CreateMessage.svelte';
	import { formatNumber } from '$lib/scripts/exchange';

	export let rate: number = 0;
	export let share: number = 0;
	export let symbol1 = '';
	export let symbol2 = '';
	export let pairExists = true;

</script>

{#if !pairExists}
	<div class="create-message">
		<CreateMessage />
	</div>
{/if}
<div class="pool-info">
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
	$info-background: rgba(255, 255, 255, 0.068);

	span {
		text-align: center;
	}

	.pool-info {
		margin-top: 10px;
		height: 100%;
		width: 100%;
		header {
			display: flex;
			align-items: center;
		}

		.info {
			height: 70px;
			margin-top: 5px;
			background: $info-background;
			border-radius: 8px;
			display: flex;
			align-items: center;
			justify-content: space-around;
		}
	}
</style>
