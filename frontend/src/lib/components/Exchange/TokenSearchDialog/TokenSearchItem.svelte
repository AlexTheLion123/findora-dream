<script context="module" lang="ts">
	import { getBalance, getDecimals, removeDecimals } from '$lib/scripts/exchange';
	import type { IExchangeContext } from '$lib/typesFrontend';
</script>

<script lang="ts">
	import { createEventDispatcher, getContext, onMount } from 'svelte';

	export let logo = '/src/lib/assets/svg/eth_logo.svg'; // default logo
	export let name: string;
	export let symbol: string;
	export let address: string;
	export let selected: boolean;

	const { signerObj }: IExchangeContext = getContext('exchange');
	const signer = signerObj.getSigner();
	const signerAddr = signerObj.getAddress();

	let balance: number;
	let decimals: number;

	const dispatch = createEventDispatcher();
	function handleClick() {
		if(selected) {
			return;
		}
		selected = true;

		dispatch('selection', {
			logo: logo,
			symbol: symbol,
			address: address,
			balance: balance,
			decimals: decimals
		});
	}

	onMount(async () => {
		decimals = decimals || await getDecimals(address, signer);
		balance = balance || removeDecimals(await getBalance(address, signer, signerAddr), decimals);
	});
</script>

<div class="container" on:click={handleClick} class:selected>
	<img src={logo} class="logo" width="35" height="35" alt="" />
	<p>{name}</p>
	<div class="balance">
		{#if balance || balance===0}
			{balance}
		{/if}
	</div>
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr 5fr;
		place-items: center;

		height: 50px;
		padding: 0 20px;
		border-bottom: 1px solid black;
	}

	.balance {
		justify-self: end;
	}

	.container:hover {
		cursor: pointer;
		background: rgb(255, 255, 255, 0.3);
	}

	.selected {
		background: rgb(255, 255, 255, 0.2);
	}
</style>
