<script lang="ts">
	import AddLiquidity from './AddLiquidityBox.svelte';
	import TradeButton from '../../TradeButton.svelte';
	import { signer, signerAddress } from '$lib/stores';
	import Positions from '$lib/components/Exchange/Liquidity/YourPositions/YourLiquidityBox.svelte';

	let showAddLiquidity=false;
</script>

{#if !showAddLiquidity}
	<Positions bind:showAddLiquidity={showAddLiquidity}/> 
{:else}
	<AddLiquidity bind:showAddLiquidity={showAddLiquidity}/>
{/if}


<style>

</style>
