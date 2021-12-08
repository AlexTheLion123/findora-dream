<script>
    import Liquidity from '$lib/components/Exchange/ExchangeLayout/Liquidity.svelte'
</script>


<div class="container">
    <div class="wrapper">
        <Liquidity/>
    </div>
</div>


<style lang="scss">
    .container {
        width: 100%;

        .wrapper {
            display: grid;
            place-items: center;
            padding: 100px 0;
        }
    }


</style>