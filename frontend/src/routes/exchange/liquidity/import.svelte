<script lang="ts">
    import ExchangeHeader from "$lib/components/Exchange/Layout/ExchangeHeader.svelte";
    import Main from '$lib/components/Exchange/Liquidity/ImportPool/Main.svelte'
</script>

<main>
    <ExchangeHeader title="Import pool" showBack={true} path="/exchange/liquidity"/>
    <Main/>
</main>

<style>
    main {
        width: 400px;
    }
</style>