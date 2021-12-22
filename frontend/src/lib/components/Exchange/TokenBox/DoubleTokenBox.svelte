<script lang="ts">
	import TokenBox from '../TokenBox/TokenBox.svelte';
	import TokenSearchMain from '../TokenSearchDialog/TokenSearchMain.svelte';
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
	let isBox1: boolean;
	// decimals passed upwards in event

	const dispatch = createEventDispatcher();

	function clearAll() {
		amount1 = 0;
		amount2 = 0;
	}

	async function handleSelection(e: CustomEvent) {
		if (e.detail.isBox1) {
			logo1 = e.detail.logo; // logo or default logo always provided
			symbol1 = e.detail.symbol; // symbol always provided
			balance1 = e.detail.balance;
			
		} else {
			logo2 = e.detail.logo; // logo or default logo always provided
			symbol2 = e.detail.symbol; // symbol always provided
			balance2 = e.detail.balance;
		}

		dispatch('selection', e.detail);
	}

	function showSearch(_isBox1: boolean) {
		isBox1 = _isBox1;
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
	on:showSearchDialog={() => showSearch(true)}
	on:input={() => dispatch('input', { isBox1: true })}
/>

<TokenBox
	bind:amount={amount2}
	address={address2}
	symbol={symbol2}
	logo={logo2}
	balance={balance2}
	{updateCurrentInput}
	on:clearAll={clearAll}
	on:showSearchDialog={() => showSearch(false)}
	on:input={() => dispatch('input', { isBox1: false })}
/>

<TokenSearchMain {isBox1} {address1} {address2} bind:showSearchDialog on:selection={handleSelection} />
