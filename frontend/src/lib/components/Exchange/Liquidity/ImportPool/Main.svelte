<script context="module" lang="ts">
	import {
		getReservesQuery,
		getPairAddress,
		checkPairExists,
		getBalance,
		removeDecimals,
		getTotalSupply,
		getDecimals,
		formatNumber
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
				return getPosition(address);
			} else {
				return 'none';
			}
		} else {
			return 'none';
		}
	}

	interface IGetPosiion {
		position: number;
		share: number;
		pool1: number;
		pool2: number;
	}

	async function getPosition(pairAddress: string): Promise<IGetPosiion> {
		const [_reserve0, _reserve1] = await getReservesQuery({
			factoryAddr: factory.address,
			addrInput: address1,
			addrOutput: address2,
			signer: signer
		});

		const bal = removeDecimals(await getBalance(pairAddress, signer, signerAddress), 18);
		const supply = removeDecimals(await getTotalSupply(pairAddress, signer, signerAddress), 18);

		const decimals1 = await getDecimals(address1, signer);
		const decimals2 = await getDecimals(address2, signer);

		const share = bal / supply;
		const pool1 = removeDecimals(_reserve0, decimals1) * share;
		const pool2 = removeDecimals(_reserve1, decimals2) * share;

		return {
			position: bal,
			share: share,
			pool1: pool1,
			pool2: pool2
		};
	}

	function handleImport() {

	}
</script>

<div class="selector">
	<TokenSelector on:tokenSelected={handleSelection} bind:address={address1} bind:symbol={symbol1} />
</div>
<div class="selector">
	<TokenSelector on:tokenSelected={handleSelection} bind:address={address2} bind:symbol={symbol2} />
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
						<p>{symbol1}-{symbol2} LP</p>
						<p>Pool share</p>
						<p>Pooled {symbol1}</p>
						<p>Pooled {symbol2}</p>
					</div>
					<div class="state-inner right">
						<p>{formatNumber(_state.position, 5)}</p>
						<p>{formatNumber(_state.share * 100, 5)}%</p>
						<p>{formatNumber(_state.pool1, 5)}</p>
						<p>{formatNumber(_state.pool2, 5)}</p>
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
