<script>
	import TokenSelector from "./TokenSelector.svelte";

	export let name; // abbreviation
	export let balance;
	export let dollars;
	export let value;
	export let logoSrc;
</script>

<div class="box">
		<div class="selector"><TokenSelector {name} {logoSrc}/></div>
		<p class="balance">Balance: {balance}</p>
		<input type="number" bind:value placeholder="0.00" />
		<p class="dollars">{dollars}</p>
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
		padding: 10px 5px;
		border-radius: $radius;

		display: grid;
		grid-template:
		"selector value" 1fr
		"balance dollars" 1fr / 1fr 1fr;
		align-items: center;
	}

	.selector {
		grid-area: selector;
	}

	.balance {
		grid-area: balance;
	}

	input {
		all: unset;
		font-size: 30px;
		color: white;
		text-align: right;
		overflow: hidden;
		max-width: 70%;

		grid-area: value;
		justify-self: end;
	}

	.dollars {
		grid-area: dollars;
		justify-self: end;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
        all: unset;
	}

	input[type='number'] {
		-moz-appearance: textfield; /* Firefox */
	}
</style>
