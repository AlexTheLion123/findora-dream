<script lang="ts">
	// this component is mainly for setting the factory and router context
	// better to do it here instead of in both swap and liquidity since they use the same contracts

	import { isConnected, signer, factory, router } from '$lib/stores';
	import {getFactoryAndRouterObjects, getFactoryAndRouterAddress, getNativeAndDollarAddr}from '$lib/scripts/exchange'
	import { setContext } from 'svelte';
	import tokens from '$lib/assets/tokens/tokens.json'

	// stores not working
	isConnected.subscribe(async (value) => {

		// TODO this is a bit of a hack, find better way
		await new Promise((resolve, reject) =>  setTimeout(()=>resolve(""), 0))

		if (value && $signer) {
			const {factoryAddress, routerAddress} = getFactoryAndRouterAddress()
			const obj = await getFactoryAndRouterObjects($signer, factoryAddress, routerAddress).catch(
				(e) => {
					alert('Broken: unable to get factory and router');
					throw 'unable to get factory and router';
				}
			);

			if(!obj.factory || !obj.router) {
				alert("unable to get factory and router contracts");
				throw("unable to get factory and router contracts")
			}

			$factory = obj.factory;
			$router = obj.router;
			console.log("factory and router objects ready")
		} else {
			$factory = null;
			$router = null;
		}
	});

	const {nativeAddr, dollarAddr} = getNativeAndDollarAddr(tokens)
	setContext("exchange", {
		nativeAddr: nativeAddr,
		dollarAddr: dollarAddr
	}) 

</script>

<slot/>