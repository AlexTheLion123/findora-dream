<script>
    import { isGrid } from '$lib/stores';
</script>

<div class="container">
    <i class="fas fa-th-list" on:click={() => $isGrid=false}></i>
    <i class="fas fa-th" on:click={() => $isGrid=true}></i>
</div>

<style lang="scss">
    .container {
        display: flex;
        justify-content: flex-end;
        margin: 30px;
    }

    i {
        color: rgb(211, 67, 236);
        font-size: 30px;
        margin: 0 20px;
        transition: 0.3s all ease;

        &:hover {
            cursor: pointer;
            transform: scale(1.1);
        }
    }
</style>