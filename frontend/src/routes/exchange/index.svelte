<script lang="ts">
	// this component is mainly for setting the factory and router context
	// better to do it here instead of in both swap and liquidity since they use the same contracts

	import Swap from '$lib/components/Exchange/ExchangeLayout/Swap.svelte';
	import Liquidity from '$lib/components/Exchange/ExchangeLayout/Liquidity.svelte';
	import { page } from '$app/stores';
	import { getFactoryAndRouterObjects } from '$lib/scripts/exchange/context';
	import { isConnected, signer, factory, router } from '$lib/stores';

	const options = [{ component: Swap }, { component: Liquidity }];
	let current = options[0];
	current = $page.path === '/exchange/swap' ? options[0] : options[1];

	isConnected.subscribe(async (value) => {
		if (value && $signer) {
			const obj = await getFactoryAndRouterObjects($signer).catch((e) => {
				alert('Broken: unable to get factory and router');
				throw 'unable to get factory and router';
			});

			$factory = obj.factory;
			$router = obj.router;
		} else {
			$factory = null;
			$router = null;
		}
	});
</script>

<svelte:component this={current} />
