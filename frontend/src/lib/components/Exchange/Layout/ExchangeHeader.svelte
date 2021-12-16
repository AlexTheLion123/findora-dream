<script lang="ts">
	export let title: string;
	export let showBack = false;
	export let backPath = '';

	import { page } from '$app/stores';

	function handleClick() {
		$page.path = backPath;
	}
</script>

<header>
	{#if showBack}
		<i class="fas fa-arrow-left" on:click={handleClick} />
	{/if}
	<p class="title">{title}</p>
	<div class="placeholder" />
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
    }
</style>