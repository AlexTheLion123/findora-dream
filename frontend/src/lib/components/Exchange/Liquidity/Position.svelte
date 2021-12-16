<script lang="ts">
	export let symbolA: string;
	export let symbolB: string;
	export let pairBalance: number;
	export let balanceA: number;
	export let balanceB: number;

    export let showFull: boolean = false;

    function toggle() {
        showFull = !showFull
    }
</script>

<div class="container">
    <li on:click={() => toggle}>
        <span class="pair"> {symbolA} - {symbolB} </span>
        <span class="balance"> {pairBalance} <i class="fas fa-chevron-down" /> </span>
    </li>

    {#if showFull}
        hello
    {/if}

</div>

<style>
    .container {
		background: rgba(255, 255, 255, 0.2);
		margin: 13px 0;
		padding: 10px;
		border-radius: 10px;
    }

	li {
		list-style: none;
		display: flex;
		justify-content: space-between;
	}
</style>
