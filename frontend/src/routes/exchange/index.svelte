<script lang="ts">
	// this component is mainly for setting the factory and router context
	// better to do it here instead of in both swap and liquidity since they use the same contracts

	import Swap from '$lib/components/Exchange/ExchangeLayout/Swap.svelte';
	import Liquidity from '$lib/components/Exchange/ExchangeLayout/Liquidity.svelte';
	import { page } from '$app/stores';
	import tokens from '$lib/assets/tokens/tokens.json';
	import { getFactoryAndRouterObjects, getFactoryAndRouterAddress } from '$lib/scripts/exchange';
	import { isConnected, signer, factory, router } from '$lib/stores';
	import { setContext } from 'svelte';

	const options = [{ component: Swap }, { component: Liquidity }];
	let current = options[0];
	current = $page.path === '/exchange/swap' ? options[0] : options[1];

	const {factoryAddress, routerAddress} = getFactoryAndRouterAddress()
	const {nativeAddr, dollarAddr} = getNativeAndDollarAddr(tokens)

	function getNativeAndDollarAddr(array: typeof tokens) {
		let nativeAddr: string = "";
		let dollarAddr: string = "";

		tokens.map(item => {
			if(item.symbol === "NATIVE") {
				nativeAddr = item.address
			}
			if(item.symbol === "USDT") {
				dollarAddr = item.address
			}
		})

		if(!nativeAddr || !dollarAddr) throw "unable to get native or dollar token addresses";

		return {
			nativeAddr: nativeAddr,
			dollarAddr: dollarAddr
		}
	}

	setContext("Exchange", {
		factoryAddress: factoryAddress,
		routerAddress: routerAddress,
		nativeTokenAddr: nativeAddr,
		dollarAddress: dollarAddr
	})

	isConnected.subscribe(async (value) => {
		if (value && $signer) {
			const obj = await getFactoryAndRouterObjects($signer, factoryAddress, routerAddress).catch((e) => {
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
