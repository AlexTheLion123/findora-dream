<script lang="ts">
	import TokenBox from '../TokenBox/TokenBox.svelte';
	import TokenSearchDialog from '../TokenSearchDialog/TokenSearchDialog.svelte';
	import { createEventDispatcher } from 'svelte';

	export let amount1: number; // bound
	export let amount2: number; // bound
	export let address1: string;
	export let address2: string;
	export let updateCurrentInput = true;

	let showSearchDialog = false;
	let balance1: number;
	let balance2: number;
	let logo1: string;
	let logo2: string;
	let symbol1: string;
	let symbol2: string;
	let whichBox: 1 | 2;
	// decimals passed upwards in event

	const dispatch = createEventDispatcher();

	function clearAll() {
		amount1 = 0;
		amount2 = 0;
	}

	async function handleSelection(e: CustomEvent) {
		hideSearch();

		if (!whichBox) {
			throw 'whichShowBox not set yet';
		}

		if (whichBox === 1) {
			logo1 = e.detail.logo; // logo or default logo always provided
			symbol1 = e.detail.symbol; // symbol always provided
			balance1 = e.detail.balance;

			dispatch('selection', { ...e.detail, tokenBox: whichBox });
		} else {
			logo2 = e.detail.logo; // logo or default logo always provided
			symbol2 = e.detail.symbol; // symbol always provided
			balance2 = e.detail.balance;
			dispatch('selection', { ...e.detail, tokenBox: whichBox });
		}
	}

	function hideSearch() {
		showSearchDialog = false;
	}

	function showSearch(num: 1 | 2) {
		whichBox = num;
		showSearchDialog = true;
	}
</script>

<TokenBox
	bind:amount={amount1}
	address={address1}
	symbol={symbol1}
	logo={logo1}
	balance={balance1}
	{updateCurrentInput}
	on:clearAll={clearAll}
	on:showSearchDialog={() => showSearch(1)}
	on:input={() => dispatch('input', { tokenBox: 1 })}
/>

<TokenBox
	bind:amount={amount2}
	address={address2}
	symbol={symbol2}
	logo={logo2}
	balance={balance2}
	{updateCurrentInput}
	on:clearAll={clearAll}
	on:showSearchDialog={() => showSearch(2)}
	on:input={() => dispatch('input', { tokenBox: 2 })}
/>

<div class="popup-wrapper" class:hide={!showSearchDialog}>
	<div class="popup-modal">
		<TokenSearchDialog {whichBox} on:selection={handleSelection} on:click={hideSearch} />
	</div>
</div>

<style>
	.popup-wrapper {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 999;

		display: grid;
		place-items: center;
	}

	.popup-modal {
		position: fixed;
		margin-top: -100px;
	}

	.hide {
		display: none;
	}
</style>
