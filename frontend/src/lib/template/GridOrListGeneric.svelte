<script>
    import Farm from '$lib/components/Yield/Farm.svelte';
    import FarmHeader from '$lib/components/Yield/FarmHeader.svelte';

    let numFarms = 50;
</script>

<div class="container">
    <FarmHeader/>

    <div class="flex-wrapper">
        {#each new Array(numFarms) as i, index}
            <Farm number={index}/>
        {/each}
    </div>

</div>

<style>
    .container {
        padding: 10px;
    }
	.flex-wrapper {
        display: flex;
        flex-wrap: wrap;
	}

</style>