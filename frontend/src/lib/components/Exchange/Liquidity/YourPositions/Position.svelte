
<script lang="ts">
	import Button2 from '../../../Misc/Button2.svelte'
	import Link from '../../../Misc/Link.svelte'

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

	let poolShare = (async function () {
		return (
			(pairBalance / removeDecimals(await getBalance(pairAddress, signer, signerAddr), 18)) * 100
		);
	})();
</script>

<main>
	<li on:click={toggle}>
		<span class="pair"> {symbolA} - {symbolB} </span>
		<span class="balance"> {pairBalance} <i class="fas fa-chevron-down" /> </span>
	</li>

	{#if showFull}
		<section class="full-content">
			<li><span>{symbolA}</span><span>{balanceA}</span></li>
			<li><span>{symbolB}</span><span>{balanceB}</span></li>
			<li><span>Pool share:</span>{#await poolShare}...{:then share}{share}%{/await}</li>
		</section>
		<div class="addMoreLink">
			<Link text="+ Add more instead" link="exchange/lskdjfsjlk"/>
		</div>
		<div class="button">
			<Button2 text="Remove Liquidity"/>
		</div>
	{/if}
</main>

<style>
	main {
		background: rgba(255, 255, 255, 0.2);
		padding: 10px;
		border-radius: 10px;
	}

	.full-content {
		padding-top: 10px;
		font-weight: 400;
	}

	li {
		list-style: none;
		display: flex;
		justify-content: space-between;
	}

	li:hover {
		cursor: pointer;
	}

	.addMoreLink {
		text-align: center;
		margin: 10px 0;
	}

</style>
