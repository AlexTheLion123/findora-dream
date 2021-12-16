<script lang="ts">
	import TradeButton from '$lib/components/Misc/TradeButton.svelte';
	import Positions from '$lib/components/Exchange/Liquidity/YourPositions/Positions.svelte'
	import ImportTokens from '$lib/components/Exchange/Liquidity/YourPositions/ImportTokens.svelte';

</script>

<Positions/>	
<ImportTokens/>
<TradeButton text="Add Liquidity" on:perfomAction={() => console.log("hi")}/>





