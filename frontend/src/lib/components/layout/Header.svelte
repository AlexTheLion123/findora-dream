<script>
	import ConnectButton from '$lib/components/layout/ConnectButton.svelte';
</script>

<header>
	<ConnectButton />
</header>

<style lang="scss">
    $header-background: none;
	$header-border: 1px solid rgba(105, 105, 206, 0.5);

	header {
		background: $header-background;

		height: 100%;
		width: 100%;

		display: flex;
		align-items: center;
		justify-content: flex-end;

		border-bottom: $header-border;
	}
</style>
