<script lang="ts">
	import TokenBox from '../TokenBox/TokenBox.svelte';
	import { createEventDispatcher } from 'svelte';

	export let address1: string;
	export let address2: string;
	export let toGetStatus: boolean;
	export let updateCurrentInput = true;
	export let approveBoth = false;

	let getStatus1: boolean = false;
	let getStatus2: boolean = false;

	if (toGetStatus) {
		if (approveBoth) {
			getStatus1 = true;
			getStatus2 = true;
		} else {
			getStatus1 = true;
			getStatus2 = false;
		}
	}

	let currentTokenBox: number | null;
	let amount1: number;
	let amount2: number;

	const dispatch = createEventDispatcher();

	function getStatus(_status: string) {
		if (!toGetStatus) {
			alert('not meant to be getting status');
			throw 'not meant to be getting status';
		}

		if (!approveBoth) {
			// standard

			if (!address2) {
				return 'select token';
			}

			if (!amount1) {
				return 'enter amount';
			}

			return _status;
		} else {
			// only add liquidity can require approve both

			if (!address2) {
				return 'select token';
			}

			if (!amount1 || !amount2) {
				return 'enter amount';
			}

			return _status;
		}
	}

	function getToDispatch(e: CustomEvent) {
		let toDispatch = e.detail;

		if (toGetStatus) {
			if (!e.detail.status) {
				alert('no status provided');
				throw 'no status provdided';
			}

			toDispatch = {
				...e.detail,
				status: getStatus(e.detail.status),
				tokenBox: currentTokenBox
			};
		}
		return toDispatch;
	}

	function updateCurrentTokenBox(num: number) {
		if (num === 1) {
			currentTokenBox = 1;
		} else {
			currentTokenBox = 2;
		}
	}

	function handleSelectionWithAmount(e: CustomEvent) {
		const toDispatch = getToDispatch(e);

		dispatch('selectionWithAmount', toDispatch);
	}

	function handleSelectionNoAmount(e: CustomEvent) {
		const toDispatch = getToDispatch(e);

		dispatch('selectionNoAmount', toDispatch);
	}
	function handleInputWithAddress(num: number, e: CustomEvent) {
		num === 1 ? (amount1 = e.detail.amount) : (amount2 = e.detail.amount);
		updateCurrentTokenBox(num);
		const toDispatch = getToDispatch(e);

		dispatch('inputWithAddress', toDispatch);
	}
	function handleInputNoAddress(num: number, e: CustomEvent) {
		num === 1 ? (amount1 = e.detail.amount) : (amount2 = e.detail.amount);
		updateCurrentTokenBox(num);

		// no reason to dispatch any event here
	}
</script>

<div class="token-box">
	<TokenBox
		bind:address={address1}
		{updateCurrentInput}
		toGetStatus={getStatus1}
		on:selectedWithAmount={(e) => handleSelectionWithAmount(e)}
		on:selectedNoAmount={(e) => handleSelectionNoAmount(e)}
		on:inputWithAddress={(e) => handleInputWithAddress(1, e)}
		on:inputNoAddress={(e) => handleInputNoAddress(1, e)}
	/>
</div>

<div class="token-box">
	<TokenBox
		bind:address={address2}
		{updateCurrentInput}
		toGetStatus={getStatus2}
		on:tokenSelectedWithNumTokens={(e) => handleSelectionWithAmount(e)}
		on:tokenSelectedWithoutNumTokens={(e) => handleSelectionNoAmount(e)}
		on:tokenNumInputWithAddress={(e) => handleInputWithAddress(2, e)}
		on:tokenNumInputWithoutAddress={(e) => handleInputNoAddress(2, e)}
	/>
</div>
