<script lang="ts">
	import TradeButton from '$lib/components/Misc/TradeButton.svelte';
	import Positions from '$lib/components/Exchange/Liquidity/YourPositions/Positions.svelte'
	import ImportTokens from '$lib/components/Exchange/Liquidity/YourPositions/ImportTokens.svelte';

	import {page} from '$app/stores'

	function handleClick() {
		$page.path = '/exchange/liquidity/add.svelte'
	}

</script>

<Positions/>	
<ImportTokens/>
<TradeButton text="Add Liquidity" on:perfomAction={handleClick}/>





