<script lang="ts">
	export let amount1: number;
	export let amount2: number;
	export let symbol1: string;
	export let symbol2: string;
</script>

<main>
	<h4>You will receive</h4>
	<div class="receive-content">
		<div class="inner left">
			<p>{amount1}</p>
			<p>{amount2}</p>
		</div>
		<div class="inner right">
			<p>{symbol1}</p>
			<p>{symbol2}</p>
		</div>
	</div>
</main>

<style>
    main {
		margin: 30px 0;
	}

	main h4 {
		margin: 5px;
	}
	.receive-content {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 10px;
		padding: 20px;

		display: flex;
	}
	.left {
		text-align: left;
		width: 100%;
	}
	.right {
		text-align: right;
	}
</style>
