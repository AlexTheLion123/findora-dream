<script context="module" lang="ts">
    import {checkAllowanceAndApproveMax} from '$lib/scripts/exchange'
    import type {IAddLiqData, IExchangeContext} from '$lib/typesFrontend'
</script>

<script lang="ts">
    import LiquidityTokenBox from "./LiquidityTokenBox.svelte";
    import PoolInfo from '../AddLiquidity/PoolInfo.svelte'
    import TradeButton from '$lib/components/Misc/TradeButton.svelte'
    import {getContext} from 'svelte'

    export let address1 = "";
    export let address2 = "";
	
	let addLiqData:IAddLiqData;
    let status = "select token";
    let disabled = true;
    let slippage = 0.05; // TODO put in gui

    $: if(status === 'action') {
        status = 'add liquidity'
        disabled = false;
    } else {
        disabled = true
    }

    // get context
	const { signerObj, getRouter }: IExchangeContext = getContext('exchange');
	const signer = signerObj.getSigner();
    const signerAddress = signerObj.getAddress();
    const router = getRouter();

    async function addLiquidity(_addLiqData: IAddLiqData) {
		if (!(_addLiqData.address1 || _addLiqData.address2 || _addLiqData.amountIn1 || _addLiqData.amountIn2)) {
			alert('not enough info');
			throw 'not enough info to add liquidity';
		}
		await checkAllowanceAndApproveMax({
			toSpend: _addLiqData.amountIn1,
			ownerAddr: signerAddress,
			spenderAddr: router.address,
			tokenAddr: _addLiqData.address1,
			signer: signer
		});
		await checkAllowanceAndApproveMax({
			toSpend: _addLiqData.amountIn2,
			ownerAddr: signerAddress,
			spenderAddr: router.address,
			tokenAddr: _addLiqData.address2,
			signer: signer
		});
		console.log('approved');

		const amountAMin = (_addLiqData.amountIn1).mul((1-slippage)*100).div(100)
		const amountBMin = (_addLiqData.amountIn2).mul((1-slippage)*100).div(100)

		let tx = await router.addLiquidity(
			_addLiqData.address1,
			_addLiqData.address2,
			_addLiqData.amountIn1,
			_addLiqData.amountIn2,
			amountAMin,
			amountBMin,
			signerAddress,
			_addLiqData.amountIn1
		); // TODO change deadline to realistic number
		await tx.wait();
		// TODO updateBoxAfterSwap();
	}

    // poolinfo props
	let share: number;
	let rate: number;
	let symbol1: string; // TODO delete, find a way to do in pool info, listen to changes
	let symbol2: string;
</script>

<LiquidityTokenBox bind:addLiqData bind:status bind:share bind:rate bind:symbol1 bind:symbol2 {address1} {address2}/>
<div class="pool-info">
	<PoolInfo {share} {rate} {symbol1} {symbol2}/>
</div>
<TradeButton text={status} {disabled} on:click={() => addLiquidity(addLiqData)}/>

<style>
	.pool-info {
		margin: 10px 0;
	}
</style>