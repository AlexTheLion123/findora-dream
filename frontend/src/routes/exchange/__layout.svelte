<script lang="ts">
	import { signer, signerAddress, provider } from '$lib/stores';
	import {
		getFactoryAndRouterObjects,
		getFactoryAndRouterAddress,
		getNativeAndDollarAddr
	} from '$lib/scripts/exchange';
	import { setContext } from 'svelte';
	import tokens from '$lib/assets/tokens/tokens.json';
	import { get } from 'svelte/store';
	import type { Signer } from 'ethers';
	import type { UniswapV2Factory, UniswapV2Router02 } from '$lib/typesUsed';
	import type { IExchangeContext } from '$lib/typesFrontend';
	import type { Web3Provider } from '@ethersproject/providers';

	import ExchangeContainer from '$lib/components/Exchange/ExchangeContainer.svelte';

	const { factoryAddress, routerAddress } = getFactoryAndRouterAddress();
	const { nativeAddr, dollarsAddr } = getNativeAndDollarAddr(tokens);

	let factory: UniswapV2Factory;
	let router: UniswapV2Router02;
	let exchangeReady = false;

	const contextObj: IExchangeContext = {
		nativeToken: {
			address: nativeAddr,
			decimals: 18
		},
		dollarsToken: {
			address: dollarsAddr,
			decimals: 18
		},
		getFactory: () => factory,
		getRouter: () => router,
		getProvider: () => get(provider) as Web3Provider,
		signerObj: {
			getSigner: () => get(signer) as Signer,
			getAddress: () => get(signerAddress) as string
		}
	};

	setContext('exchange', contextObj);

	signer.subscribe(async (value) => {
		await new Promise((resolve) => setTimeout(() => resolve(''), 0)); // TODO this is a bit of a hack, find better way

		if (value) {
			const obj = await getFactoryAndRouterObjects(
				$signer as Signer,
				factoryAddress,
				routerAddress
			).catch((e) => {
				alert('Broken: unable to get factory and router');
				throw 'unable to get factory and router';
			});

			if (!obj.factory || !obj.router) {
				alert('unable to get factory and router contracts');
				throw 'unable to get factory and router contracts';
			}

			factory = obj.factory;
			router = obj.router;

			$signerAddress = await $signer!.getAddress(); // TODO remove duplicate assingment, layout parent also assigns

			exchangeReady = true;

			console.log('factory and router objects ready');
		} else {
			console.log('no signer');
			exchangeReady = false;
		}
	});
</script>

<div class="container">
	<div class="wrapper">
			<ExchangeContainer {exchangeReady}/>
	</div>
</div>

<style lang="scss">
	
	
	.container {
		width: 100%;
	}

	.wrapper {
		display: grid;
		place-items: center;
		padding: 100px 0;
	}

	
</style>
