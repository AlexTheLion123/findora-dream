<script lang="ts">
	import TokenBox from '../../TokenBox/TokenBox.svelte';
	import { getContext } from 'svelte';
	import type { IExchangeContext } from '$lib/typesFrontend';
	import {
		checkAddressExists,
		removeDecimals,
		formatNumber,
		checkAllowanceAndApproveMax,
		addDecimals
	} from '$lib/scripts/exchange';
	import { ERC20ABI, UniswapV2PairABI } from '$lib/abis';
	import PoolInfo from './PoolInfo.svelte';
	import { BigNumber, Contract } from 'ethers';
	import TradeButton from '../../TradeButton.svelte';
	import type { Ierc20, UniswapV2Pair } from '$lib/typesUsed';

	export let showAddLiquidity: boolean;

	const SLIPPAGE = 0.01; // slippage also applies in context of liquidity

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
		addresses: [string, string];
		reserves: [number, number];
	} = {
		addresses: ['', ''],
		reserves: [0, 0]
	};

	// tokenbox props
	let updateCurrent = true;
	let amount1: number = 0;
	let amount2: number = 0;
	let address1: string = '';
	let address2: string = '';
	let decimals1: number;
	let decimals2: number;

	// poolinfo props
	let share: number;
	let rate: number;
	let symbol1: string;
	let symbol2: string;

	async function addLiquidity() {
		if (!(address1 || address2 || amount1 || amount2)) {
			alert('not enough info');
			throw 'not enough info to add liquidity';
		}
		await checkAllowanceAndApproveMax({
			toSpend: addDecimals(amount1, decimals1),
			ownerAddr: signerAddress,
			spenderAddr: router.address,
			tokenAddr: address1,
			signer: signer
		});
		await checkAllowanceAndApproveMax({
			toSpend: addDecimals(amount2, decimals1),
			ownerAddr: signerAddress,
			spenderAddr: router.address,
			tokenAddr: address2,
			signer: signer
		});
		console.log('approved');

		const amountADesired = addDecimals(amount1, decimals1);
		const amountBDesired = addDecimals(amount2, decimals2);
		const amountAMin = addDecimals(amount1 * (1 - SLIPPAGE), decimals1);
		const amountBMin = addDecimals(amount2 * (1 - SLIPPAGE), decimals2);

		console.log(
			address1,
			address2,
			amountADesired,
			amountBDesired,
			amountAMin,
			amountBMin,
			signerAddress
		);

		let tx = await router.addLiquidity(
			address1,
			address2,
			amountADesired,
			amountBDesired,
			amountAMin,
			amountBMin,
			signerAddress,
			amountADesired
		); // TODO change deadline to realistic number
		await tx.wait();
		updateBoxAfterSwap();
	}

	function updateBoxAfterSwap() {
		tokenBox1.updateBalance();
		tokenBox2.updateBalance();
		tokenBox1.handleInput();
	}

	async function getAll(_tokenBox: TokenBox) {
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
			console.log('Pair exists');

			const [reserve1, reserve2] = await getReserves(pairAddress);

			if (_tokenBox === tokenBox1) {
				amount2 = formatNumber((amount1 * reserve1) / reserve2, 5);
			} else {
				amount1 = formatNumber((amount2 * reserve2) / reserve1, 5);
			}

			rate = reserve1 / reserve2;
			console.log(amount1, reserve1);
			share = (amount1 / reserve1) * 100;
			updateCurrent = true;
		}
	}

	async function handleInput(_tokenBox: TokenBox) {
		if (!address1 || !address2) {
			// nothing to be done
			return;
		}

		if (address1 && address2) {
			getAll(_tokenBox);
		}
	}

	async function handleSelection1(_tokenBox: TokenBox, e: CustomEvent) {
		symbol1 = await getSymbol(e);

		if (address1 && address2) {
			getAll(_tokenBox);
		}
	}

	async function handleSelection2(_tokenBox: TokenBox, e: CustomEvent) {
		symbol2 = await getSymbol(e);

		if (address1 && address2) {
			getAll(_tokenBox);
		}
	}

	async function getSymbol(e: CustomEvent) {
		// symbol might not be given with address but address will always be given
		if (e.detail.symbol) {
			return e.detail.symbol;
		} else {
			return (new Contract(e.detail.address, ERC20ABI, signer) as Ierc20).symbol();
		}
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
		if ((tokenBox1.address as string) < (tokenBox2.address as string)) {
			reserves = [result[0], result[1]];
		} else {
			reserves = [result[1], result[0]];
		}

		const noDecimals = [
			removeDecimals(reserves[0], tokenBox1.decimals as number),
			removeDecimals(reserves[1], tokenBox2.decimals as number)
		];
		console.log('setting pair cache');
		pairCache.addresses = [address1, address2];
		pairCache.reserves = [noDecimals[0], noDecimals[1]];

		return noDecimals;
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
				on:tokenNumInputWithAddress={() => handleInput(tokenBox1)}
				on:tokenSelected={(e) => handleSelection1(tokenBox1, e)}
			/>
		</div>

		<div class="token-box box2">
			<TokenBox
				bind:this={tokenBox2}
				updateCurrentInput={updateCurrent}
				bind:numTokens={amount2}
				bind:address={address2}
				bind:decimals={decimals2}
				on:tokenNumInputWithAddress={() => handleInput(tokenBox2)}
				on:tokenSelected={(e) => handleSelection2(tokenBox2, e)}
			/>
		</div>
		<div class="pool-info">
			<PoolInfo {share} {rate} {symbol1} {symbol2} />
		</div>
		<div class="button">
			<TradeButton text="Add liquidity" on:perfomAction={addLiquidity} />
		</div>
	</div>

<style lang="scss">

	.wrapper {
		height: 100%;
		display: grid;
		grid-template:
			'box1' 1fr
			'box2' 1fr
			'gap' 0.2fr
			'info' 1fr
			'gap2' 0.5fr
			'btn' 1fr 
			/ 1fr;

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

	.button {
		grid-area: btn;
	}
</style>
