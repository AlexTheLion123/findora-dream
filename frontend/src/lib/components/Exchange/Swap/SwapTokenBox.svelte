<script context="module" lang="ts">
	import { formatNumber, getRoute } from '$lib/scripts/exchange';
	import { addDecimals, removeDecimals } from '$lib/scripts/exchange/utils';
	import type { IExchangeContext, ISwapData } from '$lib/typesFrontend';
	import type { BigNumber } from 'ethers';
</script>

<script lang="ts">
	import DoubleTokenBox from '../TokenBox/DoubleTokenBox.svelte';
	import { getContext, createEventDispatcher } from 'svelte';

	export let address1: string;
	export let address2: string;
	let amount1: number;
	let amount2: number;

	// get context
	const { getRouter, getFactory, nativeToken }: IExchangeContext = getContext('exchange');
	const router = getRouter();
	const factory = getFactory();
	const nativeAddr = nativeToken.address;

	let decimals1: number;
	let decimals2: number;
	let routeCache: string[] | null = null;
	const dispatch = createEventDispatcher();

	function dispatchSwapData({
		amountIn,
		amountOutDesired
	}: {
		amountIn: BigNumber;
		amountOutDesired: BigNumber;
	}) {
		console.log(address1, address2, decimals1, decimals2, routeCache);
		if (!address1 || !address2 || !decimals1 || !decimals2 || !routeCache) {
			alert('swap data not set, not enough swap info');
			throw 'not enough swap info';
		}

		const swapData = {
			amountIn: amountIn,
			amountOutDesired: amountOutDesired,
			address1: address1,
			address2: address2,
			decimals1: decimals1,
			decimals2: decimals2,
			route: routeCache
		};

		dispatch('swapData', { swapData });
	}

	async function getRouteIfCache() {
		if (!address1 || !address2) {
			return null;
		}

		if (!routeCache) {
			try {
				return await getRoute({
					addrIn: address1 as string,
					addrOut: address2 as string,
					factory: factory,
					nativeAddr: nativeAddr
				});
			} catch (e) {
				throw 'No route error';
			}
		} else {
			return routeCache;
		}
	}

	function getToDispatch(e: CustomEvent) {
		const status = e.detail.status;
		return {
			...e.detail,
			status: getStatus(status)
		};

		function getStatus(_status: string) {
			if (!address2) {
				return 'select token';
			}

			if (!amount1) {
				return 'enter amount';
			}

			if (_status.toLowerCase() === 'enter amount') {
				if (address1 && address2 && amount1 && amount2) {
					return 'action';
				}
			}
			return _status;
		}
	}

	async function getSwapTopCurrent() {
		if (!routeCache) {
			alert('No routecache');
			throw 'No route cache';
		}

		const amountInBig = addDecimals(amount1, decimals1);
		const amountsOut = await router.getAmountsOut(amountInBig, routeCache);
		const amountOut = amountsOut[amountsOut.length - 1];
		amount2 = formatNumber(removeDecimals(amountOut, decimals2), 6); // if address exists, decimals exist

		dispatchSwapData({ amountIn: amountInBig, amountOutDesired: amountOut });
	}

	async function getSwapBottomCurrent() {
		if (!routeCache) {
			alert('No routecache');
			throw 'No route cache';
		}

		const amountOutBig = addDecimals(amount2, decimals2);
		const amountsIn = await router.getAmountsIn(amountOutBig, routeCache);
		const amountIn = amountsIn[0];
		amount1 = formatNumber(removeDecimals(amountIn, decimals1), 6); // if address exists, decimals exist

		dispatchSwapData({ amountIn: amountIn, amountOutDesired: amountOutBig });
	}

	async function inputWithAddress(e: CustomEvent<any>) {
		routeCache = await getRouteIfCache();

		if (e.detail.tokenBox === 1) {
			if (address2 && address1 && amount1) {
				await getSwapTopCurrent();
			}
		} else {
			if (address1 && address2 && amount2) {
				await getSwapBottomCurrent();
			}
		}

		dispatch('event', getToDispatch(e));
	}

	async function selectionWithAmount(e: CustomEvent<any>) {
		routeCache = null;
		routeCache = await getRouteIfCache();

		if (e.detail.tokenBox === 1) {
			decimals1 = e.detail.decimals;
			if (amount2 && amount1 && address1) {
				await getSwapTopCurrent();
			}
		} else {
			decimals2 = e.detail.decimals;
			if (address1 && amount2 && address2) {
				await getSwapBottomCurrent();
			}
		}

		dispatch('event', getToDispatch(e));
	}
	async function selectionNoAmount(e: CustomEvent<any>) {
		routeCache = null;
		routeCache = await getRouteIfCache();

		if (e.detail.tokenBox === 1) {
			decimals1 = e.detail.decimals;

			if (address1 && amount1 && address2) {
				await getSwapTopCurrent();
			}
		} else {
			decimals2 = e.detail.decimals;
			console.log('selection no amount', e.detail.decimals);
			if (address2 && amount1 && address1) {
				console.log('getting swap top current');

				await getSwapTopCurrent();
			}
		}

		dispatch('event', getToDispatch(e));
	}
</script>

<DoubleTokenBox
	bind:address1
	bind:address2
	bind:amount1
	bind:amount2
	toGetStatus={true}
	on:inputWithAddress={inputWithAddress}
	on:selectionWithAmount={selectionWithAmount}
	on:selectionNoAmount={selectionNoAmount}
/>
