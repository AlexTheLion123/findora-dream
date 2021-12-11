<script lang="ts">
    import { isGrid } from '$lib/stores';

    export let number: number;
</script>

{#if $isGrid}
    <div class="farm-grid">
        {number}
    </div>
{:else}
    <div class="farm-list">
        {number}
    </div>
{/if}
<style>
    .farm-grid {
        border: 1px solid white;
        border-radius: 5px;

        width: 300px;
        height: 300px;
    }

    .farm-list {
        border: 1px solid white;
        width: 100%;
        height: 200px;
    }
</style>