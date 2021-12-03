<script>
    import Swap from '$lib/components/Exchange/Swap.svelte'
</script>

<div class="container">
    <div class="wrapper">
        <Swap/>
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