<script lang="ts">
	export let title: string;
	export let showBack = false;
	export let path = '';

	import { page } from '$app/stores';
</script>

<header>
	{#if showBack}
		<a href={path}>
			<i class="fas fa-arrow-left" />
		</a>
	{/if}
	<p class="title">{title}</p>
	<div class="placeholder" />
</header>

<style>
	a {
		all: unset;
	}
	a:hover {
		cursor: pointer;
	}
	header {
		display: flex;
		justify-content: space-between;
		height: 40px;
	}

	p {
		font-size: 20px;
	}
</style>
