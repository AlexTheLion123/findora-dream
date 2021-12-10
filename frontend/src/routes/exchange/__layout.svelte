<script lang="ts">
	// this component is mainly for setting the factory and router context
	// better to do it here instead of in both swap and liquidity since they use the same contracts

	import { isConnected, signer, factory, router } from '$lib/stores';
	import {getFactoryAndRouterObjects, getFactoryAndRouterAddress, getNativeAndDollarAddr}from '$lib/scripts/exchange'
	import { setContext } from 'svelte';
	import tokens from '$lib/assets/tokens/tokens.json'


	isConnected.subscribe(async (value) => {
		if (value && $signer) {
			const {factoryAddress, routerAddress} = getFactoryAndRouterAddress()

			const obj = await getFactoryAndRouterObjects($signer, factoryAddress, routerAddress).catch(
				(e) => {
					alert('Broken: unable to get factory and router');
					throw 'unable to get factory and router';
				}
			);

			$factory = obj.factory;
			$router = obj.router;
		} else {
			$factory = null;
			$router = null;
		}
	});

	const {nativeAddr, dollarAddr} = getNativeAndDollarAddr(tokens)
	setContext("exchange", {
		nativeAddr: nativeAddr,
		dollarAddr: dollarAddr
	}) // TODO, possibly move to highest __layoute component
</script>

<slot/>