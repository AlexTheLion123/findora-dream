<svelte:options accessors={true} />

<script context="module" lang="ts">
	import {
		getBalance,
		formatNumber,
		removeDecimals,
		checkSufficientAllowance,
		addDecimals
	} from '$lib/scripts/exchange';
	import type { IExchangeContext } from '$lib/typesFrontend';
</script>

<script lang="ts">
	import TokenSelector from './TokenSelector.svelte';
	import NumTokenInput from './NumTokenInput.svelte';
	import { createEventDispatcher, getContext } from 'svelte';

	export let amount: number;
	export let address: string;
	export let toGetStatus: boolean;
	export let updateCurrentInput: boolean;
	export let editable = true; // only 1 use so far (remove liquidity) for this variable

	// get context
	const { signerObj, getRouter }: IExchangeContext = getContext('exchange');
	const signer = signerObj.getSigner();
	const signerAddress = signerObj.getAddress();
	const router = getRouter();

	let decimals: number;
	let balance: number; // TODO incorp balance into status
	let approvalCache = {
		address: '',
		isApproved: false
	};
	let symbol: string;

	const dispatch = createEventDispatcher();

	async function updateBalance() {
		// TODO use export
		balance = removeDecimals(await getBalance(address, signer, signerAddress), decimals);
	}

	async function getStatus() {
		if (!address && !balance && !decimals) {
			return 'select token';
		}

		if (!amount) {
			return 'enter amount';
		}

		if (toGetStatus) {
			if (amount > balance) {
				return `insufficient ${symbol}`;
			}

			if (!(await getApprovalStatus())) {
				return `approve ${symbol}`;
			}
		}
		return 'fine';

		async function getApprovalStatus(): Promise<boolean> {
			let isApproved = false;
			if (approvalCache.address === address) {
				isApproved = approvalCache.isApproved;
			} else {
				isApproved = await checkSufficientAllowance({
					toSpend: addDecimals(amount, decimals),
					ownerAddr: signerAddress,
					spenderAddr: router.address,
					tokenAddr: address,
					signer: signer
				});
				setApprovalCache(address, isApproved);
			}
			return isApproved;
		}

		function setApprovalCache(_address: string, _isApproved: boolean) {
			Object.assign(approvalCache, {
				address: _address,
				isApproved: _isApproved
			});
		}
	}

	async function getToDispatch(e: CustomEvent) {
		return {
			...e.detail,
			status: await getStatus()
		};
	}

	async function handleSelection(e: CustomEvent) {
		decimals = e.detail.decimals;
		balance = e.detail.balance;
		symbol = e.detail.symbol;
		const toDispatch = await getToDispatch(e);

		amount
			? dispatch('selectionWithAmount', toDispatch)
			: dispatch('selectionNoAmount', toDispatch);
	}

	async function handleInput(e: CustomEvent) {
		// TODO use export

		const toDispatch = await getToDispatch(e);

		address ? dispatch('inputWithAddress', toDispatch) : dispatch('inputNoAddress', toDispatch);
	}
</script>

<div class="box">
	<div class="selector">
		<TokenSelector bind:address {editable} on:tokenSelected={handleSelection} />
	</div>
	<p class="balance">
		Balance: {#if balance}{formatNumber(balance, 5)}{/if}
	</p>
	<div class="input-component">
		<NumTokenInput bind:amount {updateCurrentInput} on:amountInput={handleInput} on:clearAll />
	</div>
	<!-- <p class="dollars">
		~$ {formatNumber(dollars, 2)}
	</p> -->
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
			'selector input input' 1fr
			'balance balance .' 1fr / 1fr 2fr;
		align-items: center;
	}

	.selector {
		grid-area: selector;
	}

	.balance {
		grid-area: balance;
		letter-spacing: 0.76px;
	}

	.input-component {
		grid-area: input;
		justify-self: end;
	}

	// .dollars {
	// 	grid-area: dollars;
	// 	justify-self: end;
	// }
</style>
