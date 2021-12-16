<script lang="ts">
	import TradeButton from '../TradeButton.svelte';
	import tokens from '$lib/assets/tokens/tokens.json';
	import Position from './Position.svelte';
	import { getPairAddress, getBalance, removeDecimals, getSymbol, getDecimals } from '$lib/scripts/exchange';
	import { getContext } from 'svelte';
	import type { IExchangeContext } from '$lib/typesFrontend';

	// get context
	const {
		signerObj,
		getProvider,
		nativeToken,
		dollarsToken,
		getFactory,
		getRouter
	}: IExchangeContext = getContext('exchange');

	const factory = getFactory();
	const signer = signerObj.getSigner();
	const signerAddr = signerObj.getAddress();

	export let showAddLiquidity: boolean;

	interface IToken {
		address: string,
		balance: number,
		symbol: string
	}

	let positions: {
		pair: IToken,
		tokenA: IToken,
		tokenB: IToken,
	}[] = new Array();

	let positionsProm = getPositions();

	async function getPositions() {
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
					const sym1 = await getSymbol(addr1, signer);
					const sym2 = await getSymbol(addr2, signer);

					const decimals1 = await getDecimals(addr1, signer)
					const decimals2 = await getDecimals(addr1, signer)

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

<div class="box">
	<header>
		<p>Your liquidity</p>
	</header>

	<ul class="positions">
		{#await positionsProm}
			Loading positions
		{:then _positions}
			{#each _positions as position, i}
				<Position
					symbolA={position.tokenA.symbol}
					symbolB={position.tokenB.symbol}
					pairBalance={position.pair.balance}
					pairAddress={position.pair.address}
					balanceA={position.tokenA.balance}
					balanceB={position.tokenB.balance}
				/>
			{/each}
		{/await}
	</ul>

	<section class="importTokens">
		<p>Don't see a pool you joined?</p>
		<a href="/exchage/sdlfkjslfk">Find other tokens</a>
	</section>

	<TradeButton text="Add Liquidity" on:perfomAction={() => (showAddLiquidity = true)} />


</div>

<style lang="scss">
	$box-radius: 10px;
	$box-background: rgba(172, 172, 172, 0.1);
	$box-border: 1px solid rgba(255, 255, 255, 0.2);

	.box {
		height: 400px;
		width: 400px;
		padding: 10px 20px;
		background: $box-background;

		border-radius: $box-radius;
		border: $box-border;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	header {
		display: flex;
		justify-content: center;

		font-size: 20px;
		padding: 5px;
	}

	li {
		list-style: none;
		display: flex;
		justify-content: space-between;
		margin: 15px 0;
		padding: 10px;
		border-radius: 10px;

		background: rgba(255, 255, 255, 0.2);
	}

	.importTokens {
		text-align: center;

		background: rgba(255, 255, 255, 0.2);
		border-radius: $box-radius;
		padding: 20px;

		a {
			text-decoration: none;
			color: rgb(128, 247, 251);
			&:hover {
				text-decoration: underline;
			}
		}
	}
</style>
