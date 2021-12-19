<script context="module" lang="ts">
	import { addDecimals, checkAllowanceAndApproveMax, swapExactInput } from '$lib/scripts/exchange';
	import type { IExchangeContext, ISwapData } from '$lib/typesFrontend';
</script>

<script lang="ts">
	import SwapTokenBox from '$lib/components/Exchange/Swap/SwapTokenBox.svelte';
	import RangeSlider from 'svelte-range-slider-pips';
	import TradeButton from '$lib/components/Misc/TradeButton.svelte';
	import { getContext } from 'svelte';

	export let address1: string;
	export let address2: string;

	// get context
	const { getRouter, signerObj }: IExchangeContext = getContext('exchange');
	const router = getRouter();
	const signer = signerObj.getSigner();
	const signerAddress = signerObj.getAddress();

	let swapData: ISwapData;
	let slippage = 0.05; // TODO let user change slippage
	let status: string = "select token";
	let disabled: boolean;

	// TODO get swapdata from event

	$: if (status === 'action') {
		console.log('status: ', status);
		disabled = false;
	} else {
		console.log('status: ', status);
		disabled = true;
	}

	async function callSwap(_swapData: ISwapData) {
		let tx = await checkAllowanceAndApproveMax({
			toSpend: _swapData.amountIn,
			ownerAddr: signerAddress,
			spenderAddr: router.address,
			tokenAddr: _swapData.address1,
			signer: signer
		});
		await tx?.wait();

		const amountOutMin = _swapData.amountIn.mul((1 - slippage) * 100).div(100);

		tx = await swapExactInput({
			amountInExact: _swapData.amountIn,
			amountOutMin: amountOutMin,
			route: _swapData.route,
			to: signerAddress,
			router: router,
			deadline: _swapData.amountIn
		}); // TODO change deadline to realistic number
		await tx.wait();
		alert('swap performed');

		// TODO find a way to do this updateBoxAfterSwap();
	}

	function handleEvent(e: CustomEvent) {
		if (e.detail.status) {
			status = e.detail.status;
		}
	}

	function setSwapData(e: CustomEvent) {
		console.log('got swap data');
		swapData = e.detail.swapData;
	}
</script>

<SwapTokenBox bind:address1 bind:address2 on:event={handleEvent} on:swapData={setSwapData} />
<RangeSlider id="color-pips" range="min" float pips step={5} />
<TradeButton on:click={(e) => callSwap(swapData)} text={status} {disabled} />
