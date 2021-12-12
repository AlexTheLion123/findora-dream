<svelte:options accessors={true} />

<script context="module" lang="ts">
	import { getBalance, getDecimals, getQuote } from '$lib/scripts/exchange';
	import { removeDecimals } from '$lib/scripts/exchange/utils/utils'
	import { BigNumber } from 'ethers'
	import type { Signer } from 'ethers';
	import type { UniswapV2Factory } from '$lib/typesUsed';

</script>

<script lang="ts">
	import TokenSelector from './TokenSelection/TokenSelector.svelte';
	import NumTokenInput from './NumTokenInput.svelte';
	import { createEventDispatcher, getContext } from 'svelte';

	const {
		signerObj,
		nativeToken,
		dollarsToken,
		getFactory
	} = getContext('exchange');

	const signer = signerObj.getSigner();
	const signerAddress = signerObj.getAddress();
	const nativeAddr = nativeToken.address;
	const dollarsAddr = dollarsToken.address
	const factory = getFactory();

	export let numTokens: number = 0.0;
	export let address: string = '';
	export let decimals: number = 0;
	export let dollars: number = 0;
	export let balance: number = 0;
	export let tokenToDollarRate: number = 0; // can be updated 

	$: dollars = numTokens * tokenToDollarRate;

	const CACHE_TIME = 10000; // milliseconds

	const dispatch = createEventDispatcher();

	async function handleSelection(e: CustomEvent<any>) {
		tokenToDollarRate = 0;

		if (typeof e.detail.address !== 'string') {
			alert('no address for selection');
			throw 'no address for selection';
		}

		address = e.detail.address;

		decimals = await getDecimals(e.detail.address, signer);
		balance = removeDecimals(await getBalance(e.detail.address, signer, signerAddress), decimals); // getBalance asynchronously then wait for decimals
		tokenToDollarRate = await getDollarRate(e)

		if(numTokens) {
			dispatch('tokenSelectedWithNumTokens', e.detail);
		} else {
			dispatch('tokenSelectedWithoutNumTokens', e.detail)
		}
	}

	async function handleInput(e: CustomEvent<any>) {
		/**
		 * Only dispatch event if same box's address exists
		 * numTokens is already bound to input
		*/

		if(address) {
			tokenToDollarRate = await getDollarRate(e)
			dispatch('tokenNumInputWithAddress', e.detail);

		}

	}

	let getDollarRate = (function () {
		let timestamp = 0;
		return async function (e: any): Promise<number> {
			if (Date.now() - timestamp < CACHE_TIME && tokenToDollarRate) {
				console.log("using cache")
				return tokenToDollarRate;
			}

			console.log("querying blockchain")

			if (!address) {
				alert('no address');
				throw 'no address';
			}

			if(address=== dollarsAddr) {
				return 1;
			}

			timestamp = Date.now();

			return getQuote({
				addrInput: address,
				addrOutput: dollarsAddr,
				numInput: BigNumber.from(10).pow(decimals).mul(1000000),
				nativeAddr: nativeAddr,
				factory: factory,
				signer: signer
			}).then((dollarsBig) => {
				return 1000000 / removeDecimals(dollarsBig, 18); // TODO assummes dollars has 18 decimals, fix this assumption if needs be.
			});
		};
	})();

	function formatNumber(num: number | string, decimals: number) {
		if (typeof num === 'string') {
			return Math.round(parseInt(num) * 10 ** decimals) / 10 ** decimals;
		}
		return Math.round(num * 10 ** decimals) / 10 ** decimals;
	}
</script>

<div class="box">
	<div class="selector"><TokenSelector on:tokenSelected={handleSelection} /></div>
	<p class="balance">
		Balance: {formatNumber(balance, 4)}
	</p>
	<div class="input-component">
		<NumTokenInput on:tokenNumInput={handleInput} bind:value={numTokens} />
	</div>
	<p class="dollars">
		~$ {formatNumber(dollars, 2)}
	</p>
</div>

<style lang="scss">
	$background: none;
	$radius: 10px;
	$border: 1px solid rgba(255, 255, 255, 0.1);

	.box {
		background: $background;
		width: 100%;
		height: 100%;
		border: $border;
		padding: 10px 5px;
		border-radius: $radius;

		display: grid;
		grid-template:
			'selector input' 1fr
			'balance dollars' 1fr / 1fr 2fr;
		align-items: center;
	}

	.selector {
		grid-area: selector;
	}

	.balance {
		grid-area: balance;
	}

	.input-component {
		grid-area: input;
		justify-self: end;
	}

	.dollars {
		grid-area: dollars;
		justify-self: end;
	}
</style>
