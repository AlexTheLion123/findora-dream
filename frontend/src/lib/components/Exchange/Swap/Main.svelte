<script context="module" lang="ts">
	import { approveMax, swapExactInput, removeDecimals } from '$lib/scripts/exchange';
	import type { IExchangeContext, ISwapData } from '$lib/typesFrontend';
</script>

<script lang="ts">
	import SwapTokenBox from '$lib/components/Exchange/Swap/SwapTokenBox.svelte';
	import RangeSlider from 'svelte-range-slider-pips';
	import TradeButton from '$lib/components/Misc/TradeButton.svelte';
	import { getContext } from 'svelte';
import { BigNumber } from 'ethers';

	export let address1: string;
	export let address2: string;

	// get context
	const { getRouter, signerObj }: IExchangeContext = getContext('exchange');
	const router = getRouter();
	const signer = signerObj.getSigner();
	const signerAddress = signerObj.getAddress();

	let swapData: ISwapData | null;
	let slippage = 0.05; // TODO let user change slippage
	let status: string;
	let disabled: boolean = true;

	// TODO get swapdata from event

	async function swap() {
		if(!swapData) {
			throw "swapdata not set yet"
		}

		const amountOutMin = swapData.amountOutDesired.mul(BigNumber.from((1 - slippage)*10000)).div(10000);

		return swapExactInput({
			amountInExact: swapData.amountIn,
			amountOutMin: amountOutMin,
			route: swapData.route,
			to: signerAddress,
			router: router,
			deadline: swapData.amountIn
		}); // TODO change deadline to realistic number

		// TODO find a way to do this updateBoxAfterSwap();
	}

	async function _approveMax() {
		return approveMax({
			tokenAddress: address1,
			spenderAddress: router.address,
			signer: signer
		});
	}

	async function handleClick() {
		let tx;

		if (status === 'swap') {
			tx = await swap();
			await tx.wait();
			return;
		}

		if (isStatusApprove()) {
			tx = await _approveMax();
			await tx.wait();
			return;
		}

		throw "neither swap nor approve, shouldn't happen";
	}

	function updateStatus(e: CustomEvent) {
		status = e.detail.status;

		if (e.detail?.swapData) {
			swapData = e.detail.swapData;
			disabled = false;
			return;
		} else {
			swapData = null;
		}

		disabled = isStatusApproveOrSwap() ? false : true;
	}

	function isStatusApprove() {
		return status.toLowerCase().includes('approve')
	}

	function isStatusApproveOrSwap(): boolean {
		return isStatusApprove() || status.toLowerCase().includes('swap');
	}
</script>

<SwapTokenBox {address1} {address2} on:statusUpdate={updateStatus} />
<div class="slider">
	<RangeSlider id="color-pips" range="min" float pips step={5} />

</div>
<TradeButton on:click={handleClick} text={status} {disabled} />
