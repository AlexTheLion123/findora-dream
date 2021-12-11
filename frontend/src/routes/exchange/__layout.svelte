<script lang="ts">
	import { page } from '$app/stores';
	import { signer } from '$lib/stores';
	import {
		getFactoryAndRouterObjects,
		getFactoryAndRouterAddress,
		getNativeAndDollarAddr
	} from '$lib/scripts/exchange';
	import { setContext } from 'svelte';
	import tokens from '$lib/assets/tokens/tokens.json';
	import type { UniswapV2Factory, UniswapV2Router02 } from '$lib/typesUsed';

    import Liquidity from '$lib/components/Exchange/ExchangeLayout/Liquidity.svelte'
    import Swap from '$lib/components/Exchange/ExchangeLayout/Swap.svelte'

	const { factoryAddress, routerAddress } = getFactoryAndRouterAddress(); 
	const { nativeAddr, dollarAddr } = getNativeAndDollarAddr(tokens);

	let factory: UniswapV2Factory;
	let router: UniswapV2Router02;
	let exchangeReady = false;

	setContext('exchange', {
		nativeAddr: nativeAddr,
		dollarAddr: dollarAddr,
		getFactory: () => factory,
		getRouter: () => router
	});

	signer.subscribe(async (value) => {
		await new Promise((resolve) => setTimeout(() => resolve(''), 0)); // TODO this is a bit of a hack, find better way

		if (value) {
			const obj = await getFactoryAndRouterObjects(value, factoryAddress, routerAddress).catch(
				(e) => {
					alert('Broken: unable to get factory and router');
					throw 'unable to get factory and router';
				}
			);

			if (!obj.factory || !obj.router) {
				alert('unable to get factory and router contracts');
				throw 'unable to get factory and router contracts';
			}

			factory = obj.factory;
			router = obj.router;

			exchangeReady = true;

			console.log('factory and router objects ready');
		} else {
			console.log('no signer')
		}
	});

</script>

<div class="container">
	<div class="wrapper">
		{#if $page.path==="/exchange/swap"}
			<Swap bind:swapReady={exchangeReady}/>
		{:else if $page.path==="/exchange/liquidity"}
			<Liquidity bind:liquidityReady={exchangeReady}/>
		{:else}
			Something is wrong
			page: {$page.path}
		{/if}
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
