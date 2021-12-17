<script context="module" lang="ts">
	import {
		addDecimals,
		checkAddressExists,
		formatNumber,
		getSymbol,
		removeDecimals
	} from '$lib/scripts/exchange';
	import { Contract } from 'ethers';
	import { UniswapV2PairABI } from '$lib/abis';
	import type { BigNumber } from 'ethers';
	import type { IAddLiqData, IExchangeContext } from '$lib/typesFrontend';
	import type { UniswapV2Pair } from '$lib/typesUsed';
</script>

<script lang="ts">
	import DoubleTokenBox from '../../TokenBox/DoubleTokenBox.svelte';
	import { getContext } from 'svelte';

	export let addLiqData: IAddLiqData;
	export let status: string;

	// poolinfo props
	export let share: number;
	export let rate: number;
	export let symbol1: string; // TODO delete, find a way to do in pool info, listen to changes
	export let symbol2: string;

	let updateCurrent1 = false;
	let updateCurrent2 = false;

	let amount1: number;
	let amount2: number;
	let address1: string;
	let address2: string;
	let decimals1: number;
	let decimals2: number;

	let pairCache: {
		addresses: [string, string];
		reserves: [number, number];
	} = {
		addresses: ['', ''],
		reserves: [0, 0]
	};

	// get context
	const { getFactory, signerObj }: IExchangeContext = getContext('exchange');
	const factory = getFactory();
	const signer = signerObj.getSigner();

	function setAddLiqData() {
		if (!amount1 || !amount2 || !address1 || !address2 || !decimals1 || !decimals2 || !pairCache) {
			alert('swap data not set, not enough swap info');
			throw 'not enough swap info';
		}

		const amountIn1 = addDecimals(amount1, decimals1);
		const amountIn2 = addDecimals(amount2, decimals2);

		addLiqData = {
			amountIn1: amountIn1,
			amountIn2: amountIn2,
			address1: address1,
			address2: address2,
			decimals1: decimals1,
			decimals2: decimals2
		};
	}

	async function getAll(numCurrent: number) {
		const pairAddress = await factory.getPair(address1, address2);

		if (!checkAddressExists(pairAddress)) {
			// Pair does not exist yet
			console.log('Pair does not exist, you will be the first to create liquidity');
			updateCurrent1 = false;
			updateCurrent2 = false;
			share = 100;

			if (amount1 && amount2) {
				rate = amount1 / amount2;

				setAddLiqData();
			}
		} else {
			// pair exists

			const [reserve1, reserve2] = await getReserves(pairAddress);

			if (numCurrent === 1) {
				amount2 = formatNumber((amount1 * reserve1) / reserve2, 5);
			} else {
				amount1 = formatNumber((amount2 * reserve2) / reserve1, 5);
			}

			rate = reserve1 / reserve2;
			share = (amount1 / reserve1) * 100;

			updateCurrent1 = true;
			updateCurrent2 = true;

			setAddLiqData();
		}
	}

	async function inputWithAddress(e: CustomEvent) {
		if (!address1 || !address2) {
			// nothing to be done
			return;
		}
		if (address1 && address2) {
			getAll(e.detail.num);
		}
	}

	async function handleSelection(e: CustomEvent) {
		if (e.detail.num === 1) {
			symbol1 = await getSymbolWrapper(e);
		} else {
			symbol2 = await getSymbolWrapper(e);
		}

		if (address1 && address2) {
			getAll(e.detail.num);
		}
	}

	async function getSymbolWrapper(e: CustomEvent) {
		// symbol might not be given with address but address will always be given
		if (e.detail.symbol) {
			return e.detail.symbol;
		}
		if (e.detail.num === 1) return getSymbol(address1, signer);
		if (e.detail.num === 2) return getSymbol(address2, signer);
	}

	async function getReserves(pairAddress: string): Promise<number[]> {
		if (
			address1 &&
			address2 &&
			pairCache.addresses.includes(address1) &&
			pairCache.addresses.includes(address2)
		) {
			console.log('using reserves cache');
			return pairCache.reserves;
		}

		const tokenInstance = new Contract(pairAddress, UniswapV2PairABI, signer) as UniswapV2Pair;

		let reserves: [BigNumber, BigNumber];
		const result = await tokenInstance.getReserves();
		if (address1 < (address2 as string)) {
			reserves = [result[0], result[1]];
		} else {
			reserves = [result[1], result[0]];
		}

		const noDecimals = [
			removeDecimals(reserves[0], decimals1),
			removeDecimals(reserves[1], decimals2)
		];
		console.log('setting pair cache');
		pairCache.addresses = [address1, address2];
		pairCache.reserves = [noDecimals[0], noDecimals[1]];

		return noDecimals;
	}
</script>

<DoubleTokenBox
	on:inputWithAddress={inputWithAddress}
	on:selectionWithTokens={handleSelection}
	on:selectionWithoutTokens={handleSelection}
	bind:amount1
	bind:amount2
	bind:decimals1
	bind:decimals2
	bind:address1
	bind:address2
	bind:status
	{updateCurrent1}
	{updateCurrent2}
/>
