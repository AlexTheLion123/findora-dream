<script lang="ts">
	import TokenBox from '../TokenBox.svelte';
	import { getContext } from 'svelte';
	import type { IExchangeContext } from '$lib/typesFrontend';
	import { checkAddressExists, removeDecimals } from '$lib/scripts/exchange/utils';
	import { createEventDispatcher } from 'svelte';
	import { UniswapV2PairABI } from '$lib/abis';

	import PoolInfo from '../PoolInfo.svelte';
	import { BigNumber, Contract } from 'ethers';
	import type { UniswapV2Pair } from '$lib/typesUsed';

	let tokenBox1: TokenBox;
	let tokenBox2: TokenBox;
	// props
	let updateCurrent = true;
	let amount1: number;
	let amount2: number;
	let address1: string;
	let address2: string;
	let decimals1: number;
	let decimals2: number;

	// get context
	const { signerObj, nativeToken, dollarsToken, getFactory, getRouter }: IExchangeContext =
		getContext('exchange');

	const signer = signerObj.getSigner();
	const signerAddress = signerObj.getAddress();
	const nativeAddr = nativeToken.address;
	const dollarsAddr = dollarsToken.address;
	const factory = getFactory();
	const router = getRouter();

	let share: number;
	let rate: number;
	let pairCache: {
		address: string;
		reserves: [number, number];
	};

	async function handleInput1() {
		if (!tokenBox2.address || !tokenBox1.address) {
			return;
		}

		const pairAddress = await factory.getPair(tokenBox1.address as string, tokenBox2.address);
		if (!checkAddressExists(pairAddress)) {
			console.log('Pair does not exist, you will be the first to create liquidity');
            updateCurrent = false;
			share = 0;

			if (tokenBox1.numTokens && tokenBox2.numTokens) {
				rate = tokenBox1.numTokens / tokenBox2.numTokens;
			}

		} else {
			// pair exists
            updateCurrent = true;

			const [reserve1, reserve2] = await getReserves(pairAddress);
			rate = reserve1 / reserve2;
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

	function handleInput2() {}
</script>

<div class="wrapper">

    <div class="token-box box1">
        <TokenBox
            bind:this={tokenBox1}
            bind:updateCurrentInput={updateCurrent}
            bind:numTokens={amount1}
            bind:address={address1}
            bind:decimals={decimals1}
            on:tokenNumInputWithAddress={handleInput1}
        />
    </div>
    
    <div class="token-box box2">
        <TokenBox
            bind:this={tokenBox2}
            bind:numTokens={amount2}
            bind:address={address2}
            bind:decimals={decimals2}
            bind:updateCurrentInput={updateCurrent}
            on:tokenNumInputWithAddress={handleInput2}
        />
    </div>
    <div class="pool-info">
        <PoolInfo bind:share bind:rate/>
    </div>
</div>

<style>
    .wrapper {
        height: 100%;
        display: grid;
        grid-template: 
        "box1" 1fr 
        "box2" 1fr 
        "gap" 0.2fr 
        "info" 1fr 
        "gap2" 0.3fr / 1fr;
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
