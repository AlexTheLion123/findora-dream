<script context="module" lang="ts">
    import { addDecimals, checkAllowanceAndApproveMax, swapExactInput } from '$lib/scripts/exchange';
	import type { IExchangeContext, ISwapData } from '$lib/typesFrontend';
</script>

<script lang="ts">
	import SwapTokenBox from '$lib/components/Exchange/Swap/SwapTokenBox.svelte';
	import RangeSlider from 'svelte-range-slider-pips';
    import TradeButton from '$lib/components/Misc/TradeButton.svelte'
    import {getContext} from 'svelte'

	let swapData: ISwapData;
    let slippage = 0.05; // TODO let user change slippage

    let status = "select token"
    let disabled = true;

    $: console.log(status)

    $: if(status === 'action') {
        status = 'swap'
        disabled = false;
    } else {
        disabled = true;
    }

	// get context
	const { getRouter, signerObj }: IExchangeContext = getContext('exchange');
	const router = getRouter();
	const signer = signerObj.getSigner();
	const signerAddress = signerObj.getAddress();

	async function callSwap(swapData: ISwapData) {
        
        let tx = await checkAllowanceAndApproveMax({
            toSpend: swapData.amountIn,
			ownerAddr: signerAddress,
			spenderAddr: router.address,
			tokenAddr: swapData.address1,
			signer: signer
		});
		await tx?.wait();

        const amountOutMin = swapData.amountIn.mul((1-slippage)*100).div(100);

		tx = await swapExactInput({
			amountInExact: swapData.amountIn,
			amountOutMin: amountOutMin,
			route: swapData.route,
			to: signerAddress,
			router: router,
			deadline: swapData.amountIn
		}); // TODO change deadline to realistic number
		await tx.wait();
		alert('swap performed');

		// TODO find a way to do this updateBoxAfterSwap();
	}
</script>

<SwapTokenBox bind:swapData bind:status/>
<RangeSlider id="color-pips" range="min" float pips step={5}/>
<TradeButton on:click={(e) => callSwap(swapData)} text={status} {disabled}/>