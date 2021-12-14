<script lang="ts">
	export let rate: number;
	export let share: number;
</script>

<div class="box">
	<header>Prices and Pool Share</header>
	<div class="info">
		<span class="rate1">{rate}</span>
		<span class="pool-share">{share}%</span>
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
