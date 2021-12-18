
<script lang="ts">
	import Link from '$lib/components/Misc/Link.svelte'
	import LinkButtonStyle from '$lib/components/Misc/LInkButtonStyle.svelte';

	import { getBalance, removeDecimals, formatNumber } from '$lib/scripts/exchange';
	import { getContext } from 'svelte';
	import type { IExchangeContext } from '$lib/typesFrontend';

	export let symbolA: string;
	export let symbolB: string;
	export let pairBalance: number;
	export let pairAddress: string;
	export let balanceA: number;
	export let balanceB: number;
	export let addressA: string;
	export let addressB: string;

	export let showFull: boolean = false;

	// get context
	const { signerObj }: IExchangeContext = getContext('exchange');

	const signer = signerObj.getSigner();
	const signerAddr = signerObj.getAddress();

	function toggle() {
		showFull = !showFull;
	}

	let poolShare = (async function () {
		return (
			(pairBalance / removeDecimals(await getBalance(pairAddress, signer, signerAddr), 18)) * 100
		);
	})();
</script>

<main>
	<li on:click={toggle} class="item-header">
		<span class="pair"> {symbolA} - {symbolB} </span>
		<span class="balance"> {formatNumber(pairBalance, 5)} <i class="fas fa-chevron-down" /> </span>
	</li>

	{#if showFull}
		<ul class="sub-content">
			<li><span>{symbolA}</span><span>{balanceA}</span></li>
			<li><span>{symbolB}</span><span>{balanceB}</span></li>
			<li><span>Pool share:</span>{#await poolShare then share}{share}%{/await}</li>
		</ul>
		<div class="addMoreLink">
			<Link text="+ Add more" link={`/exchange/liquidity/add/${addressA}/${addressB}`}/>
		</div>
		<div class="button">
			<LinkButtonStyle text="Remove Liquidity" link={`/exchange/liquidity/remove/${pairAddress}`}/>
		</div>
	{/if}
</main>

<style>
	main {
		background: rgba(255, 255, 255, 0.2);
		padding: 10px;
		border-radius: 10px;
	}

	.sub-content {
		padding-top: 10px;
		font-weight: 300;
	}

	.sub-content li {
			margin: 12px 0;
	}

	li {
		list-style: none;
		display: flex;
		justify-content: space-between;
	}

	.item-header:hover {
		cursor: pointer;
	}

	.addMoreLink {
		text-align: center;
		margin: 10px 0;
	}

</style>
