<script context="module" lang="ts">
	import { getPosition } from '$lib/scripts/exchange';
	import type { IExchangeContext, Positions } from '$lib/typesFrontend';
</script>

<script lang="ts">
	import tokens from '$lib/assets/tokens/tokens.json';
	import Position from './PositionDropDown.svelte';
	import { getContext } from 'svelte';

	// get context
	const { signerObj, getFactory }: IExchangeContext = getContext('exchange');

	const factory = getFactory();
	const signer = signerObj.getSigner();
	const signerAddr = signerObj.getAddress();

	let positionsProm = getPositions();

	interface IPositionStorage {
		pair: {
			address: string;
			symbol: string;
		};
		tokenA: {
			address: string;
			symbol: string;
		};
		tokenB: {
			address: string;
			symbol: string;
		};
	}

	async function getPositions() {
		const storage = localStorage.getItem('positions');

		if (storage) {
			console.log("getting positions from storage")
			return getPositionsFromStorage(storage);
		} else {
			console.log("getting positions from blockchain")
			return getPositionsQuery();
		}
	}

	async function getPositionsFromStorage(storage: string) {
		let positions: Array<Positions> = new Array();
		const myPositions: Array<IPositionStorage> = JSON.parse(storage);

		for (let i = 0; i < myPositions.length; i++) {
			const position = await getPosition({
				addr1: myPositions[i].tokenA.address,
				addr2: myPositions[i].tokenB.address,
				factoryAddr: factory.address,
				signer: signer,
				signerAddr: signerAddr,
				pairAddr: myPositions[i].pair.address,
				symbol1: myPositions[i].tokenA.symbol,
				symbol2: myPositions[i].tokenB.symbol
			});
			positions.push(position);
		}

		return positions;
	}

	async function getPositionsQuery() {
		// TODO look at doing this in load function
		const nativeAddr = tokens[0].address;
		let positions: Array<Positions> = new Array();

		for (let i = 0; i < tokens.length; i++) {
			if (i == 0) {
				continue;
			}

			try {
				const item = await getPosition({
					addr1: nativeAddr,
					addr2: tokens[i].address,
					factoryAddr: factory.address,
					signer: signer,
					signerAddr: signerAddr
				});
				positions.push(item);
			} catch (error) {
				console.log(error, 'nothing to worry about');
			}
		}

		localStorage.setItem('positions', JSON.stringify(positionsToStorageArr(positions)));

		return positions;
	}

	function positionsToStorageArr(positions: Array<Positions>) {
		return positions.map((item) => {
			return {
				pair: {
					address: item.pair.address,
					symbol: item.pair.symbol
				},
				tokenA: {
					address: item.tokenA.address,
					symbol: item.tokenA.symbol
				},
				tokenB: {
					address: item.tokenB.address,
					symbol: item.tokenB.symbol
				}
			};
		});
	}

	// TODO get positions from local storage
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
