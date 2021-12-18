<script>
	import Link from '$lib/components/Misc/Link.svelte';
</script>

<main class="import">
	<p>Don't see a pool you joined?</p>
	<Link link="/exchange/liquidity/import" text="Find other tokens" />
</main>

<style>
	.import {
		text-align: center;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 10px;
		padding: 20px;
	}
</style>
