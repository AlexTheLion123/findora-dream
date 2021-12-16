<script lang="ts">
	import Liquidity from './Liquidity/Liquidity.svelte';
	import Swap from './Swap/Swap.svelte';
	import { page } from '$app/stores';

    export let exchangeReady:boolean;

	let showAddLiquidity = true;
</script>

{#if exchangeReady}
<div class="box">
	<header>
		<i class="fas fa-arrow-left" on:click={() => (showAddLiquidity = false)} />
		<p class="title">Add Liquidity</p>
		<div class="placeholder" />
	</header>

	{#if $page.path === '/exchange/swap'}
		<Swap/>
	{:else if $page.path === '/exchange/liquidity'}
		<Liquidity/>
	{/if}
</div>
{/if}

<style lang="scss">
	$box-radius: 10px;
	$box-background: rgba(172, 172, 172, 0.1);
	$box-border: 1px solid rgba(255, 255, 255, 0.2);

	.box {
		padding: 0 30px;
		background: $box-background;

		border-radius: $box-radius;
		border: $box-border;
	}
</style>
