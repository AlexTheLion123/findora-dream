<script lang="ts">
    import YourLiquidityBox from '$lib/components/Exchange/Liquidity/YourPositions/YourLiquidityBox.svelte';
	import AddLiquidityBox from '$lib/components/Exchange/Liquidity/AddLiquidity/AddLiquidityBox.svelte';
    
    import {page} from '$app/stores'

	type Option = {
		header: string,
		backButton: boolean
		component: any,
	};

	const options: Array<Option> = [
		{component: YourLiquidityBox, header: "Your Liquidity", backButton:false},
		{component: AddLiquidityBox, header: "Add liquidity", backButton:true}
	]

	let selected: Option = options[0];

	if($page.path === '/exchange/liquidity/positions') {
		selected = options[1]
	} else if($page.path === '/exchange/liquidity/add') {
		selected = options[2]
	}
    
</script>

<svelte:component this={selected.component}/>

<style>

</style>