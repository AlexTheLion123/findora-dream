<script lang="ts">
	import ExchangeHeader from '$lib/components/Exchange/Layout/ExchangeHeader.svelte';
	import Main from '$lib/components/Exchange/Liquidity/AddLiquidity/Main.svelte'

	const address1 = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601';
	const address2 = '';
</script>

<main>
	<header>
		<ExchangeHeader title="Add Liquidity" showBack={true} path={'/exchange/liquidity'}/>
	</header>
	<Main {address1} {address2}/>
</main>

<style>
	main {
		width: 500px;
	}

</style>