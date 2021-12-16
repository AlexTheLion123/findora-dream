<script lang="ts">
	import AddLiquidity from './AddLiquidity.svelte';
	import TradeButton from '../TradeButton.svelte';
	import { signer, signerAddress } from '$lib/stores';
	import YourPositions from '$lib/components/Exchange/Liquidity/Positions.svelte';

	export let liquidityReady = false;

	let showAddLiquidity=false;
</script>

{#if $signer && $signerAddress && liquidityReady}
		{#if !showAddLiquidity}
			<YourPositions bind:showAddLiquidity={showAddLiquidity}/> 
		{:else}
			<AddLiquidity bind:showAddLiquidity={showAddLiquidity}/>
		{/if}
{:else}
	<div class="add-button">
		<TradeButton text="Connect to metamask"/>
	</div>
{/if}

<style>
	

</style>
