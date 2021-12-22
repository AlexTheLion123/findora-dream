<script context="module" lang="ts">
	import { formatNumber} from '$lib/scripts/exchange';
</script>

<script lang="ts">
	import TokenSelector from './TokenSelector.svelte';
	import NumTokenInput from './NumTokenInput.svelte';

	export let address: string;
	export let amount: number;
	export let symbol: string;
	export let logo: string; // logo src
	export let updateCurrentInput: boolean;
	export let balance: number;
	export let editable = true; // only 1 use so far (remove liquidity) for this variable

</script>

<div class="box">
	<div class="selector">
		<TokenSelector {address} {logo} {symbol} {editable} on:showSearchDialog />
	</div>
	<p class="balance">
		Balance: {#if balance}{formatNumber(balance, 5)}{/if}
	</p>
	<div class="input-component">
		<NumTokenInput bind:amount {updateCurrentInput} on:input on:clearAll />
	</div>
	<!-- <p class="dollars">
		~$ {formatNumber(dollars, 2)}
	</p> -->
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
			'selector input input' 1fr
			'balance balance .' 1fr / 1fr 2fr;
		align-items: center;
	}

	.selector {
		grid-area: selector;
	}

	.balance {
		grid-area: balance;
		letter-spacing: 0.76px;
	}

	.input-component {
		grid-area: input;
		justify-self: end;
	}

	// .dollars {
	// 	grid-area: dollars;
	// 	justify-self: end;
	// }
</style>
