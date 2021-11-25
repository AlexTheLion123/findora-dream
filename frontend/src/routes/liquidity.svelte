<script>
    import Liquidity from '$lib/components/Liquidity.svelte'
</script>


<div class="container">
    <div class="wrapper">
        <Liquidity/>
    </div>
</div>


<style lang="scss">
    .container {
        width: 100%;
        background: black;

        .wrapper {
            display: grid;
            place-items: center;
            padding: 100px 0;
        }
    }


</style>