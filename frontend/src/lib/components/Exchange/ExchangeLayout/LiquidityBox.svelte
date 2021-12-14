<script lang="ts">
	import TokenBox from '../TokenBox.svelte';
	import { getContext } from 'svelte';
	import type { IExchangeContext } from '$lib/typesFrontend';
	import { checkAddressExists, removeDecimals, formatNumber } from '$lib/scripts/exchange';
	import { ERC20ABI, UniswapV2PairABI } from '$lib/abis';
	import PoolInfo from '../PoolInfo.svelte';
	import { BigNumber, Contract } from 'ethers';
	import type { Ierc20, UniswapV2Pair } from '$lib/typesUsed';

	let tokenBox1: TokenBox;
	let tokenBox2: TokenBox;

	// get context
	const { signerObj, nativeToken, dollarsToken, getFactory, getRouter }: IExchangeContext =
		getContext('exchange');

	const signer = signerObj.getSigner();
	const signerAddress = signerObj.getAddress();
	const nativeAddr = nativeToken.address;
	const dollarsAddr = dollarsToken.address;
	const factory = getFactory();
	const router = getRouter();

	let pairCache: {
		address: string;
		reserves: [number, number];
	};

	// tokenbox props
	let updateCurrent = true;
	let amount1: number = 0;
	let amount2: number = 0;
	let address1: string = "";
	let address2: string = "";
	let decimals1: number;
	let decimals2: number;

	// poolinfo props
	let share: number;
	let rate: number;
	let symbol1: string;
	let symbol2: string;

	async function handleInput() {
        if(!address1 || !address2) {
            // nothing to be done
            return;
        }
		
        const pairAddress = await factory.getPair(address1, address2);
		if (!checkAddressExists(pairAddress)) {
			console.log('Pair does not exist, you will be the first to create liquidity');
			updateCurrent = false;
			share = 100;

			if (tokenBox1.numTokens && tokenBox2.numTokens) {
				rate = tokenBox1.numTokens / tokenBox2.numTokens;
			}
		} else {
			// pair exists
            console.log("Pair exists")
			updateCurrent = true;

            // get quote from reserves!!!!!!!

			const [reserve1, reserve2] = await getReserves(pairAddress);
			rate = reserve1/reserve2;
            share = amount1/reserve1;
		}
	}

	async function handleSelection1(e: CustomEvent) {
		symbol2 = await getSymbol(e);
	}

	async function handleSelection2(e: CustomEvent) {
		symbol1 = await getSymbol(e);
	}

	async function getSymbol(e: CustomEvent) {
		// symbol might not be given with address but address will always be given
		if (e.detail.symbol) {
			return e.detail.symbol;
		} else {
			return (new Contract(e.detail.address, ERC20ABI, signer) as Ierc20).symbol();
		}
	}

	async function getReserves(pairAddress: string): Promise<[number, number]> {
		const tokenInstance = new Contract(pairAddress, UniswapV2PairABI, signer) as UniswapV2Pair;

		let reserves: [BigNumber, BigNumber];
		const result = await tokenInstance.getReserves();
		if ((tokenBox1.address as string) < (tokenBox2.address as string)) {
			reserves = [result[0], result[1]];
		} else {
			reserves = [result[1], result[0]];
		}

		return [
			removeDecimals(reserves[0], tokenBox1.decimals as number),
			removeDecimals(reserves[1], tokenBox2.decimals as number)
		];
	}

</script>

<div class="wrapper">
	<div class="token-box box1">
		<TokenBox
			bind:this={tokenBox1}
			updateCurrentInput={updateCurrent}
			bind:numTokens={amount1}
			bind:address={address1}
			bind:decimals={decimals1}
			on:tokenNumInputWithAddress={() => handleInput()}
            on:tokenSelected={e => handleSelection1(e)}
		/>
	</div>

	<div class="token-box box2">
		<TokenBox
			bind:this={tokenBox2}
			updateCurrentInput={updateCurrent}
			bind:numTokens={amount2}
			bind:address={address2}
			bind:decimals={decimals2}
			on:tokenNumInputWithAddress={() => handleInput()}
            on:tokenSelected={e => handleSelection2(e)}
		/>
	</div>
	<div class="pool-info">
		<PoolInfo {share} {rate} {symbol1} {symbol2}/>
	</div>
</div>

<style>
	.wrapper {
		height: 100%;
		display: grid;
		grid-template:
			'box1' 1fr
			'box2' 1fr
			'gap' 0.2fr
			'info' 1fr
			'gap2' 0.3fr / 1fr;
	}

	.box1 {
		grid-area: box1;
	}

	.box2 {
		grid-area: box2;
	}

	.pool-info {
		grid-area: info;
	}
</style>
