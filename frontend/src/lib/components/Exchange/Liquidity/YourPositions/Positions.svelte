<script lang="ts">
	import tokens from '$lib/assets/tokens/tokens.json';
	import Position from './Position.svelte';

	import { getContext } from 'svelte';
	import {
		getPairAddress,
		getBalance,
		removeDecimals,
		getSymbol,
		getDecimals
	} from '$lib/scripts/exchange';
	import type { IExchangeContext } from '$lib/typesFrontend';

	let positions: {
		pair: IToken;
		tokenA: IToken;
		tokenB: IToken;
	}[] = new Array();

	interface IToken {
		address: string;
		balance: number;
		symbol: string;
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

			const pairAddress = getPairAddress(factory.address, addr1, addr2);

			try {
				const balance = removeDecimals(await getBalance(pairAddress, signer, signerAddr), 18);
				console.log('balance', balance);

				if (balance) {
					// TODO look at promise.all
					const sym1 = await getSymbol(addr1, signer);
					const sym2 = await getSymbol(addr2, signer);

					const decimals1 = await getDecimals(addr1, signer);
					const decimals2 = await getDecimals(addr1, signer);

					const balance1 = removeDecimals(await getBalance(addr1, signer, signerAddr), decimals1);
					const balance2 = removeDecimals(await getBalance(addr2, signer, signerAddr), decimals2);

					const item = {
						pair: {
							address: pairAddress,
							balance: balance,
							symbol: `${sym1} - ${sym2}`
						},
						tokenA: {
							address: nativeAddr,
							balance: balance1,
							symbol: sym1
						},
						tokenB: {
							address: tokens[i].address,
							balance: balance2,
							symbol: sym2
						}
					};

					positions.push(item);
				}
			} catch (e) {
				console.log(e);
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

