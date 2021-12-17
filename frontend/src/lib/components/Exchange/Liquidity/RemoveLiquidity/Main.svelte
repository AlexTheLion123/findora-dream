<script context="module" lang="ts">
	import { Contract } from 'ethers';
	import { ERC20ABI } from '$lib/abis';
    import {getSymbol} from '$lib/scripts/exchange'
	import type { UniswapV2Pair } from '$lib/typesUsed';
</script>

<script lang="ts">
	import TokenBox from '$lib/components/Exchange/TokenBox/TokenBox.svelte';
	import TradeButton from '$lib/components/Misc/TradeButton.svelte';
	import RangeSlider from 'svelte-range-slider-pips';
	import { getContext } from 'svelte';

	const { signerObj } = getContext('exchange');
	const signer = signerObj.getSigner();

	let amount: number;
	export let address: string;

    let symbol = "";
	_setSymbol();

	async function _setSymbol() {
		const tokenInstance = new Contract(address, ERC20ABI, signer) as UniswapV2Pair;
        console.log(await tokenInstance.deployed())
		const token0 = await tokenInstance.token0();
		const token1 = await tokenInstance.token1();

        const sym1 = await getSymbol(token0, signer);
        const sym2 = await getSymbol(token1, signer);

        symbol = `${sym1} - ${sym2}`
        console.log(symbol);
	}

	function callRemove() {
		console.log('to remove liquidity');
	}
</script>

<TokenBox editable={false} numTokens={amount} {address} {symbol}/>
<RangeSlider id="color-pips" range="min" float pips step={5} />
<div class="button">
	<TradeButton text="Remove Liquidity" on:click={callRemove} />
</div>

<style>
	.button {
		margin-top: 20px;
	}
</style>
