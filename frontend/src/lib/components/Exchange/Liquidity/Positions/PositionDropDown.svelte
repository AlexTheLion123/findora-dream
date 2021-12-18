
<script lang="ts">
	import PositionContent from './PositionContent.svelte'
	import { formatNumber } from '$lib/scripts/exchange';

	export let symbolA: string;
	export let symbolB: string;
	export let pairBalance: number;
	export let pairAddress: string;
	export let balanceA: number;
	export let balanceB: number;
	export let addressA: string;
	export let addressB: string;

	export let showFull: boolean = false;

	function toggle() {
		showFull = !showFull;
	}

</script>

<main>
	<li on:click={toggle} class="item-header">
		<span class="pair"> {symbolA} - {symbolB} </span>
		<span class="balance"> {formatNumber(pairBalance, 5)} <i class="fas fa-chevron-down" /> </span>
	</li>

	{#if showFull}
		<PositionContent {addressA} {addressB} {symbolA} {symbolB} {balanceA} {balanceB} {pairAddress} {pairBalance}/>
	{/if}
</main>

<style>
	main {
		background: rgba(255, 255, 255, 0.2);
		padding: 10px;
		border-radius: 10px;
	}

	li {
		list-style: none;
		display: flex;
		justify-content: space-between;
	}

	.item-header:hover {
		cursor: pointer;
	}

</style>
