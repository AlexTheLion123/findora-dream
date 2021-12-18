<script context="module" lang="ts">
	import type { IExchangeContext } from '$lib/typesFrontend';
	import { removeDecimals, getBalance } from '$lib/scripts/exchange';
</script>

<script lang="ts">
    import Link from '$lib/components/Misc/Link.svelte'
	import LinkButtonStyle from '$lib/components/Misc/LInkButtonStyle.svelte';
	import { getContext } from 'svelte';

	export let symbolA: string;
	export let symbolB: string;
	export let balanceA: number;
	export let balanceB: number;
	export let pairAddress: string;
	export let pairBalance: number;
	export let addressA: string;
	export let addressB: string;

	// get context
	const { signerObj }: IExchangeContext = getContext('exchange');
	const signer = signerObj.getSigner();
	const signerAddr = signerObj.getAddress();

	let poolShare = (async function () {
		return (
			(pairBalance / removeDecimals(await getBalance(pairAddress, signer, signerAddr), 18)) * 100
		);
	})();
</script>


<ul class="position-content">
	<li><span>{symbolA}</span><span>{balanceA}</span></li>
	<li><span>{symbolB}</span><span>{balanceB}</span></li>
	<li><span>Pool share:</span>{#await poolShare then share}{share}%{/await}</li>
</ul>
<div class="addMoreLink">
	<Link text="+ Add more" link={`/exchange/liquidity/add/${addressA}/${addressB}`} />
</div>
<div class="button">
	<LinkButtonStyle text="Remove Liquidity" link={`/exchange/liquidity/remove/${pairAddress}`} />
</div>

<style>
	.position-content {
		padding-top: 10px;
		font-weight: 300;
	}

	.position-content li {
		margin: 12px 0;
	}

	li {
		list-style: none;
		display: flex;
		justify-content: space-between;
	}

	.addMoreLink {
		text-align: center;
		margin: 10px 0;
	}
</style>
