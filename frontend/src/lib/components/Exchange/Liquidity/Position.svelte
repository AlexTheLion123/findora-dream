<script lang="ts">
	import { getBalance, removeDecimals } from '$lib/scripts/exchange';
	import { getContext } from 'svelte';
	import type { IExchangeContext } from '$lib/typesFrontend';

	export let symbolA: string;
	export let symbolB: string;
	export let pairBalance: number;
	export let pairAddress: string;
	export let balanceA: number;
	export let balanceB: number;

	export let showFull: boolean = false;

	// get context
	const { signerObj }: IExchangeContext = getContext('exchange');

	const signer = signerObj.getSigner();
	const signerAddr = signerObj.getAddress();

	function toggle() {
		showFull = !showFull;
		console.log('hello');
	}

	let poolShare = (async function() {
        return pairBalance/removeDecimals(await getBalance(pairAddress, signer, signerAddr), 18)*100;
    })()
</script>

<div class="container">
	<li on:click={toggle}>
		<span class="pair"> {symbolA} - {symbolB} </span>
		<span class="balance"> {pairBalance} <i class="fas fa-chevron-down" /> </span>
	</li>

	{#if showFull}
		<li><span>Pooled {symbolA}</span><span>{balanceA}</span></li>
		<li><span>Pooled {symbolB}</span><span>{balanceB}</span></li>
		<li><span>Pool share:</span>{#await poolShare}...{:then share}{share}%{/await}</li>
	{/if}
</div>

<style>
	.container {
		background: rgba(255, 255, 255, 0.2);
		margin: 13px 0;
		padding: 10px;
		border-radius: 10px;
	}

	li {
		list-style: none;
		display: flex;
		justify-content: space-between;
	}

	li:hover {
		cursor: pointer;
	}
</style>
