<script context="module" lang="ts">
	import {
		getPairAddress,
		checkPairExists,
		getBalance,
		removeDecimals,
		formatNumber,
		getPosition
	} from '$lib/scripts/exchange';
	import type { IExchangeContext } from '$lib/typesFrontend';
</script>

<script lang="ts">
	import Button2 from '$lib/components/Misc/Button2.svelte';
	import TokenSelector from '$lib/components/Exchange/TokenBox/TokenSelector.svelte';
	import Link from '$lib/components/Misc/Link.svelte';
	import { getContext } from 'svelte';

	let address1: string;
	let address2: string;
	let symbol1: string;
	let symbol2: string;

	let state = new Promise((resolve) => resolve('uninitialized'));

	// get context
	const { getFactory, signerObj }: IExchangeContext = getContext('exchange');
	const factory = getFactory();
	const signer = signerObj.getSigner();
	const signerAddress = signerObj.getAddress();

	function handleSelection() {
		if (address1 && address2) {
			state = search();
		}
	}

	async function search() {
		const pairExists = await checkPairExists(factory, address1, address2);

		if (pairExists) {
			const address = getPairAddress(factory.address, address1, address2);
			const bal = removeDecimals(await getBalance(address, signer, signerAddress), 18);

			if (bal) {
				return getPosition({
					addr1: address1,
					addr2: address2,
					factoryAddr: factory.address,
					signer: signer,
					signerAddr: signerAddress,
					pairAddr: address,
					symbol1: symbol1,
					symbol2: symbol2
				});
			} else {
				return 'none';
			}
		} else {
			return 'none';
		}
	}

	async function handleImport() {
		if (!state || state === 'uninitialized') {
			alert('Pool not found');
			throw 'Pool not found';
		}

		const storage = localStorage.getItem('positions');
		const pairAddress = getPairAddress(factory.address, address1, address2);
		const toStorage = getItemToStorage(pairAddress);

		if (storage) {
			if (storage.indexOf(pairAddress) > -1) {
				alert('Pool already added');
				return;
			}

			localStorage.setItem('positions', JSON.stringify([...JSON.parse(storage), toStorage]))
			alert('Pool imported')
		} else {
			localStorage.setItem('positions', JSON.stringify(toStorage));
			alert('Pool imported');
		}
	}

	function getItemToStorage(pairAddr: string) {
		return {
			pair: {
				address: pairAddr,
				symbol: `${symbol1}-${symbol2}`
			},
			tokenA: {
				address: address1,
				symbol: `${symbol1}`
			},
			tokenB: {
				address: address2,
				symbol: `${symbol2}`
			}
		};
	}
</script>

<div class="selector">
	<TokenSelector on:tokenSelected={handleSelection} bind:address={address1} editable={true}/>
</div>
<div class="selector">
	<TokenSelector on:tokenSelected={handleSelection} bind:address={address2} editable={true}/>
</div>
<div class="state">
	{#await state}
		Loading ..
	{:then _state}
		<section class="content">
			{#if _state === 'uninitialized'}
				<p>Select a token to find your liquidity</p>
			{:else if _state === 'none'}
				<p>You don't have liquidity in this pool yet.</p>
				<Link link="/exchange/liquidity/add" text="Add Liquidity" />
			{:else}
				<h3>Your position</h3>
				<div class="table">
					<div class="state-inner left">
						<p>{_state.tokenA.symbol}-{_state.tokenB.symbol} LP</p>
						<p>Pool share</p>
						<p>Pooled {_state.tokenA.symbol}</p>
						<p>Pooled {_state.tokenB.symbol}</p>
					</div>
					<div class="state-inner right">
						<p>{formatNumber(_state.pair.balance, 5)}</p>
						<p>{formatNumber(_state.pair.share * 100, 5)}%</p>
						<p>{formatNumber(_state.tokenA.balance, 5)}</p>
						<p>{formatNumber(_state.tokenB.balance, 5)}</p>
					</div>
				</div>

				<div class="link">
					<Button2 text="Import" on:click={handleImport} />
				</div>
			{/if}
		</section>
	{/await}
</div>

<style>
	.selector {
		margin: 20px 0;
	}

	.link {
		margin-top: 20px;
	}

	.content {
		margin-top: 15px;
		padding: 15px;

		background: rgba(255, 255, 255, 0.1);
		border-radius: 15px;
		text-align: center;
	}

	.table {
		margin-top: 15px;
		display: flex;
		justify-content: space-between;
		font-weight: 300;
	}

	.state-inner {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.left {
		text-align: left;
	}

	.right {
		text-align: right;
	}
</style>
