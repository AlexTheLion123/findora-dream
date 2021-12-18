<script lang="ts">
	import ExchangeHeader from '$lib/components/Exchange/Layout/ExchangeHeader.svelte';
	import Main from '$lib/components/Exchange/Liquidity/AddLiquidity/Main.svelte'

    import {page} from '$app/stores'

    const addr1 = $page.params.address1
    const addr2 = $page.params.address2
</script>

<main>
	<header>
		<ExchangeHeader title="Add Liquidity" showBack={true} path={'/exchange/liquidity'}/>
	</header>
	<Main address1={addr1} address2={addr2}/>
</main>

<style>
	main {
		width: 500px;
	}

</style>