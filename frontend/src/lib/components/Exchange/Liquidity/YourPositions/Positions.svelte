<script lang="ts">
	import tokens from '$lib/assets/tokens/tokens.json';
	import Position from './Position.svelte';

	import { getContext } from 'svelte';
	import { getPosition } from '$lib/scripts/exchange';
	import type { IExchangeContext } from '$lib/typesFrontend';
	import { Contract } from 'ethers';

	let positions: {
		pair: IToken;
		tokenA: IToken;
		tokenB: IToken;
	}[] = new Array();

	interface IToken {
		address: string;
		balance: number;
		symbol: string;
		decimals: number;
	}

	// get context
	const { signerObj, getFactory }: IExchangeContext = getContext('exchange');

	const factory = getFactory();
	const signer = signerObj.getSigner();
	const signerAddr = signerObj.getAddress();

	let positionsProm = getPositions();

	async function getPositions() {
		// TODO look at doing this in load function
		const nativeAddr = tokens[0].address;
		for (let i = 0; i < tokens.length; i++) {
			if (i == 0) {
				continue;
			}

			const addr1 = nativeAddr;
			const addr2 = tokens[i].address;

			try {
				const item = await getPosition(addr1, addr2, factory.address, signer, signerAddr);
				positions.push(item);
			} catch (error) {
				console.log(error, 'nothing to worry about')
			}
		}
		return positions;
	}
</script>

<main class="positions">
	{#await positionsProm}
		Loading positions
	{:then _positions}
		{#each _positions as position, i}
			<div class="position">
				<Position
					symbolA={position.tokenA.symbol}
					symbolB={position.tokenB.symbol}
					pairBalance={position.pair.balance}
					pairAddress={position.pair.address}
					balanceA={position.tokenA.balance}
					balanceB={position.tokenB.balance}
					addressA={position.tokenA.address}
					addressB={position.tokenB.address}
				/>
			</div>
		{/each}
	{/await}
</main>

<style>
	.position:not(:first-of-type) {
		margin-top: 10px;
	}
</style>
