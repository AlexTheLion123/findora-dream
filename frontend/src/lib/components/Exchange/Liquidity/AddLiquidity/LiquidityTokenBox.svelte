<script context="module" lang="ts">
	import {
		addDecimals,
		checkAddressExists,
		formatNumber,
		removeDecimals,
		getAllowance
	} from '$lib/scripts/exchange';
	import { Contract, constants } from 'ethers';
	import { UniswapV2PairABI } from '$lib/abis';
	import type { BigNumber } from 'ethers';
	import type { IAddLiqData, IExchangeContext } from '$lib/typesFrontend';
	import type { UniswapV2Pair } from '$lib/typesUsed';
</script>

<script lang="ts">
	import DoubleTokenBox from '../../TokenBox/DoubleTokenBox.svelte';
	import { getContext } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	export let address1: string;
	export let address2: string;
	// poolinfo
	let poolinfo = {
		share: 0,
		rate: 0,
		pairExists: true 
	}

	// get context
	const { getFactory, signerObj, getRouter }: IExchangeContext = getContext('exchange');
	const factory = getFactory();
	const signer = signerObj.getSigner();
	const signerAddr = signerObj.getAddress();
	const router = getRouter();

	const dispatch = createEventDispatcher();

	let amount1: number;
	let amount2: number;
	let decimals1: number;
	let decimals2: number;
	let balance1: number;
	let balance2: number;
	let symbol1: string;
	let symbol2: string;
	let updateCurrentInput = false;

	let isApproved1: boolean;
	let isApproved2: boolean;
	let allowance1: BigNumber;
	let allowance2: BigNumber;
	let isCurrentBox1: boolean;

	let pair: {
		addresses: {
			address1: string;
			address2: string;
			pair: string;
		};
		reserves: {
			reserve1: number;
			reserve2: number;
		};
	} | null = null;


	function getLiqData() {
		if (!amount1 || !amount2 || !address1 || !address2 || !decimals1 || !decimals2) {
			alert('swap data not set, not enough swap info');
			throw 'not enough swap info';
		}

		const amountIn1 = addDecimals(amount1, decimals1);
		const amountIn2 = addDecimals(amount2, decimals2);

		return {
			address1: address1,
			address2: address2,
			amountIn1: amountIn1,
			amountIn2: amountIn2,
			decimals1: decimals1,
			decimals2: decimals2,
			pair: pair
		};
	}

	function getTop() {
		if (!pair) {
			throw 'pairdne';
		}

		return formatNumber((amount2 * pair.reserves.reserve2) / pair.reserves.reserve1, 5);
	}

	function getBottom() {
		if (!pair) {
			throw 'pairdne';
		}

		return formatNumber((amount1 * pair.reserves.reserve1) / pair.reserves.reserve2, 5);
	}

	async function getReserves(pairAddress: string): Promise<number[]> {
		const tokenInstance = new Contract(pairAddress, UniswapV2PairABI, signer) as UniswapV2Pair;

		let reserves: [BigNumber, BigNumber];
		const result = await tokenInstance.getReserves();
		if (address1 < (address2 as string)) {
			reserves = [result[0], result[1]];
		} else {
			reserves = [result[1], result[0]];
		}

		const reservesNoDecimals = [
			removeDecimals(reserves[0], decimals1),
			removeDecimals(reserves[1], decimals2)
		];
		return reservesNoDecimals;
	}

	function getPairObj(pairAddress: string, reserve1: number, reserve2: number) {
		poolinfo.rate = reserve1 / reserve2

		return {
			addresses: {
				pair: pairAddress,
				address1: address1,
				address2: address2
			},
			reserves: {
				reserve1: reserve1,
				reserve2: reserve2
			},
		};
	}

	function checkApproval(_amount: number, _decimals: number, _allowance: BigNumber) {
		return addDecimals(_amount, _decimals).lt(_allowance);
	}

	function getStatus() {
		if (!isApproved1 && address1) {
			return `approve ${symbol1} ${address1}`;
		}

		if (!isApproved2 && address2) {
			return `approve ${symbol2} ${address2}`;
		}

		if (!address2) {
			return 'select token';
		}

		if (!amount1) {
			return 'enter amount 1';
		}

		if (amount1 > balance1) {
			return `insufficient ${symbol1}`;
		}

		if (!amount2) {
			return 'enter amount 2';
		}

		if (amount2 > balance2) {
			return `insufficient ${symbol2}`;
		}

		if (!pair?.addresses.pair) {
			return 'create pair';
		} else {
			return 'add liquidity';
		}
	}

	function afterEventHook(e?: CustomEvent) {
		const status = getStatus();
		let liqData = null;
		
		
		if (status.includes('create') || status.includes('add')) {
			console.log(status);
			
			liqData = getLiqData();
		}

		dispatch('statusUpdate', {
			...e?.detail,
			status: status,
			liqData: liqData,
			symbol1: symbol1,
			symbol2: symbol2,
			poolinfo: poolinfo
		});
	}

	function handleInput1() {
		isCurrentBox1 = true;

		if(!decimals1 || !allowance1) {
			return
		}

		isApproved1 = checkApproval(amount1, decimals1, allowance1);

		if (address1 && address2 && pair) {
			amount2 = getBottom();
			poolinfo.share = (amount1 / pair!.reserves.reserve1) * 100;
		}
	}

	function handleInput2() {
		isCurrentBox1 = false;
		isApproved2 = checkApproval(amount2, decimals2, allowance2);

		if (address1 && address2 && pair) {
			amount1 = getTop();
			poolinfo.share = (amount1 / pair!.reserves.reserve1) * 100;
		}
	}

	export function approveFromParent(_address: string) {
		// bound to parent instead of below comment

		if (_address === address1) {
			isApproved1 = true;
			allowance1 = constants.MaxUint256;
		} else if(_address === address2) {
			isApproved2 = true;
			allowance2 = constants.MaxUint256;
		} else {
			throw "address does not match address1 or address2"
		}

		afterEventHook();
	}

	async function selection1(e: CustomEvent) {
		balance1 = e.detail.balance;
		decimals1 = e.detail.decimals;
		address1 = e.detail.address;
		symbol1 = e.detail.symbol;

		allowance1 = await getAllowance({
			tokenAddress: address1,
			signer: signer,
			signerAddr: signerAddr,
			spenderAddr: router.address
		});

		isApproved1 = checkApproval(0, decimals1, allowance1);
	}

	async function selection2(e: CustomEvent) {
		balance2 = e.detail.balance;
		decimals2 = e.detail.decimals;
		address2 = e.detail.address;
		symbol2 = e.detail.symbol;

		allowance2 = await getAllowance({
			tokenAddress: address2,
			signer: signer,
			signerAddr: signerAddr,
			spenderAddr: router.address
		});

		isApproved2 = checkApproval(0, decimals2, allowance2);
	}

	function handleInput(e: CustomEvent) {
		e.detail.isBox1 ? handleInput1() : handleInput2();

		if(!pair && amount1 && amount2) {
			poolinfo.rate = amount1 / amount2;
		}

		afterEventHook(e);
	}

	function getOther() {
		if (amount1 && isCurrentBox1) {
			amount2 = getBottom();
		} else if (amount2 && !isCurrentBox1) {
			amount1 = getTop();
		}
	}

	async function handleSelection(e: CustomEvent) {
		e.detail.isBox1 ? await selection1(e) : await selection2(e);

		if (address1 && address2) {
			const pairAddress = await factory.getPair(address1, address2);

			if (!checkAddressExists(pairAddress)) {
				console.log('address dne');
				pair=null;
				poolinfo.share = 100;
				poolinfo.pairExists = false;
				updateCurrentInput = false;
			} else {
				updateCurrentInput = true;
				const [reserve1, reserve2] = await getReserves(pairAddress);
				pair = getPairObj(pairAddress, reserve1, reserve2);
				poolinfo.pairExists = true


				getOther();
			}
		}

		afterEventHook(e);
	}
</script>

<DoubleTokenBox
	bind:amount1
	bind:amount2
	{address1}
	{address2}
	{updateCurrentInput}
	on:input={handleInput}
	on:selection={handleSelection}
/>
