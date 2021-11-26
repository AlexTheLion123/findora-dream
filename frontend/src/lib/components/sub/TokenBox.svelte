<script>
	export let name; // abbreviation
	export let balance;
	export let dollars;
	export let value;
</script>

<div class="box">
	<div class="box-left">
		<button class="symbol">{name}</button>
		<p class="balance">{balance}</p>
	</div>
	<div class="box-right">
		<input type="number" bind:value placeholder="0.00" />
		<p class="dollars">{dollars}</p>
	</div>
</div>

<style lang="scss">
	$background: none;
	$radius: 10px;
	$border: 1px solid rgba(255, 255, 255, 0.1);

	.box {
		background: $background;
		width: 100%;
		height: 100%;
		border: $border;

		border-radius: $radius;

		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	input {
		all: unset;
		font-size: 30px;
		color: white;
		text-align: right;
		overflow: hidden;
		max-width: 70%;
	}

	p.dollars {
		text-align: right;
		max-width: 70%;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
        all: unset;
	}

	input[type='number'] {
		-moz-appearance: textfield; /* Firefox */
	}
</style>
