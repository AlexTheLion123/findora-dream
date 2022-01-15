<script context="module" lang="ts">
	import type { IAddLiqData, IExchangeContext } from '$lib/typesFrontend';
</script>

<script lang="ts">
	import LiquidityTokenBox from './LiquidityTokenBox.svelte';
	import PoolInfo from '../AddLiquidity/PoolInfo.svelte';
	import TradeButton from '$lib/components/Misc/TradeButton.svelte';
	import { getContext } from 'svelte';
	import { approveMax } from '$lib/scripts/exchange';

	export let address1: string;
	export let address2: string;

	const { signerObj, getRouter }: IExchangeContext = getContext('exchange');
	const signerAddress = signerObj.getAddress();
	const router = getRouter();
	const signer = signerObj.getSigner();

	const PRECISION = 7;

	let liqData: IAddLiqData | null;
	let status: string;
	let disabled = true;
	let slippage = 0.05; // TODO put in gui
	let symbol1: string;
	let symbol2: string;
	let approveOnChild: (str: string) => void;

	// poolinfo props
	let share = 0;
	let rate = 0;
	let pairExists: boolean = true;

	function addLiquidity() {
		if (!liqData) {
			alert('not enough info');
			throw 'not enough info to add liquidity';
		}

		const amountAMin = liqData.amountIn1.mul((1 - slippage) * 10 ** PRECISION).div(10 ** PRECISION);
		const amountBMin = liqData.amountIn2.mul((1 - slippage) * 10 ** PRECISION).div(10 ** PRECISION);

		return router.addLiquidity(
			liqData.address1,
			liqData.address2,
			liqData.amountIn1,
			liqData.amountIn2,
			amountAMin,
			amountBMin,
			signerAddress,
			liqData.amountIn1
		); // TODO change deadline to realistic number
	}

	function _approveMax(tokenAddr: string) {
		return approveMax({
			tokenAddress: tokenAddr,
			spenderAddress: router.address,
			signer: signer
		});
	}

	async function handleClick() {
		let tx;

		if (statusIncludes('add') || statusIncludes('create')) {
			// add liquidity

			tx = await addLiquidity();
			await tx.wait();
			return;
		}

		if (statusIncludes('approve')) {
			const arr = status.split(' ');
			const address = arr[arr.length - 1];

			tx = await _approveMax(address);
			await tx.wait();
			approveOnChild(address);
			return;
		}
	}

	function statusIncludes(str: string) {
		return status.toLowerCase().includes(str);
	}

	function handleStatus(e: CustomEvent) {
		status = e.detail.status;
		symbol1 = e.detail.symbol1;
		symbol2 = e.detail.symbol2;
		liqData = e.detail.liqData;

		rate = e.detail.poolinfo.rate;
		share = e.detail.poolinfo.share;
		pairExists = e.detail.poolinfo.pairExists;

		updateButtonStatus();

		function updateButtonStatus() {
			if (statusIncludes('approve') || statusIncludes('add') || statusIncludes('create')) {
				disabled = false;
			} else {
				disabled = true;
			}
		}
	}

	
</script>

<LiquidityTokenBox
	bind:approveFromParent={approveOnChild}
	{address1}
	{address2}
	on:statusUpdate={handleStatus}
/>
<div class="pool-info">
	<PoolInfo {share} {rate} {symbol1} {symbol2} {pairExists}/>
</div>
<TradeButton text={status} {disabled} on:click={handleClick} />

<style>
	.pool-info {
		margin: 20px 0;
	}
</style>
