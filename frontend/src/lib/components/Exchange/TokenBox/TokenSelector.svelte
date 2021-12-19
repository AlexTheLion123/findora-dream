<script context="module" lang="ts">
	import {
		getSymbol,
		getDecimals,
		addDecimals,
		removeDecimals,
		getBalance
	} from '$lib/scripts/exchange';
	import type { IExchangeContext } from '$lib/typesFrontend';
</script>

<script lang="ts">
	import TokenSearchDialog from '../TokenSearchDialog/TokenSearchDialog.svelte';
	import { createEventDispatcher, getContext } from 'svelte';

	export let address: string;
	export let editable: boolean; // TODO - don't allow hover on non-editable

	let logo: string;
	let symbol: string = 'Select';
	let showSearch = false; // bound to child

	const { signerObj }: IExchangeContext = getContext('exchange');
	const signer = signerObj.getSigner();
	const signerAddress = signerObj.getAddress();
	const dispatch = createEventDispatcher();

	initialize();

	async function handleSelection(e: CustomEvent<any>) {
		address = e.detail.address;
		logo = e.detail.logo; // logo or default logo always provided
		symbol = e.detail.symbol; // symbol always provided

		const decimals = await getDecimals(e.detail.address, signer); // TODO maybe search box will provide these?
		const balance = removeDecimals(await getBalance(e.detail.address, signer, signerAddress),decimals);

		dispatch('tokenSelected', {
			...e.detail,
			decimals: decimals,
			balance: balance
		});
	}

	async function initialize() {
		// sometimes address provided initially

		if (address) {
			const decimals = await getDecimals(address, signer);
			const balance = removeDecimals(await getBalance(address, signer, signerAddress), decimals);
			symbol = await getSymbol(address, signer);
			logo =  '/src/lib/assets/svg/eth_logo.svg'// TODO getLogo()

			dispatch('tokenSelected', {
				address: address,
				decimals: decimals,
				balance: balance,
				symbol: symbol,
				logo: logo
			});
		}
	}
</script>

<button on:click|preventDefault={() => (showSearch = true)} disabled={!editable}>
	<img src={logo} class="symbol" width="35" height="35" alt="" />
	<p>{symbol}</p>
	<i class="fas fa-chevron-down" />
</button>

{#if showSearch}
	<div class="popup-modal-wrapper">
		<TokenSearchDialog bind:isShown={showSearch} on:tokenSelected={handleSelection} />
	</div>
{/if}

<style>
	button {
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 20px;
		height: 50px;
		padding: 15px 15px 15px 5px;

		width: 100%;

		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	button:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.symbol {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 100%;
		box-sizing: content-box;
		padding: 5px;
	}
</style>
