<svelte:options accessors={true}/>



<script lang="ts">
	import TokenSelector from './TokenSelection/TokenSelector.svelte';
	import NumTokenInput from './NumTokenInput.svelte';

	export let numTokens = 0.00;
	export let dollars: number = 0.00;
	export let balance: number = 0.00;
	export let address: string = ""; 
	export let decimals: number;

	// export let address: string; updated in parent with event

	function formatNumber(num: number | string, decimals: number) {
		if (typeof num === 'string') {
			return Math.round(parseInt(num) * 10 ** decimals) / 10 ** decimals;
		}
		return Math.round(num * 10 ** decimals) / 10 ** decimals;
	}

</script>

<div class="box">
	<div class="selector"><TokenSelector on:tokenSelected/></div>
	<p class="balance">Balance: {formatNumber(balance, 4)}</p>
	<div class="input-component">
		<NumTokenInput on:tokenNumInput bind:value={numTokens}/>
	</div>
	<p class="dollars">~$ {formatNumber(dollars, 2)}</p>
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
			'selector input' 1fr
			'balance dollars' 1fr / 1fr 2fr;
		align-items: center;
	}

	.selector {
		grid-area: selector;
	}

	.balance {
		grid-area: balance;
	}

	.input-component {
		grid-area: input;
		justify-self: end;
	}

	.dollars {
		grid-area: dollars;
		justify-self: end;
	}

	
</style>
