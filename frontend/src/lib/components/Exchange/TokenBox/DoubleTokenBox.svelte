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
	let amount1: number;
	let amount2: number;

	if (toGetStatus) {
		if (approveBoth) {
			getStatus1 = true;
			getStatus2 = true;
		} else {
			getStatus1 = true;
			getStatus2 = false;
		}
	}


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

	function getToDispatch(num: 1 | 2, e: CustomEvent) {
		let toDispatch = {
			...e.detail,
			tokenBox: num
		};

		if (toGetStatus && e.detail.status) {
			toDispatch = {
				...toDispatch,
				status: getStatus(e.detail.status),
			};
		}
		return toDispatch;
	}

	function handleSelectionWithAmount(num: 1 | 2,e: CustomEvent) {
		const toDispatch = getToDispatch(num, e);

		dispatch('selectionWithAmount', toDispatch);
	}

	function handleSelectionNoAmount(num: 1 | 2,e: CustomEvent) {
		const toDispatch = getToDispatch(num, e);
		
		dispatch('selectionNoAmount', toDispatch);
	}
	function handleInputWithAddress(num: 1 | 2, e: CustomEvent) {
		num === 1 ? (amount1 = e.detail.amount) : (amount2 = e.detail.amount);
		const toDispatch = getToDispatch(num, e);

		dispatch('inputWithAddress', toDispatch);
	}
	function handleInputNoAddress(num: 1 | 2, e: CustomEvent) {
		num === 1 ? (amount1 = e.detail.amount) : (amount2 = e.detail.amount);
		const toDispatch = getToDispatch(num, e);

		dispatch('inputNoAddress', toDispatch)
		// no reason to dispatch any event here
	}
</script>

<div class="token-box">
	<TokenBox
		bind:address={address1}
		{updateCurrentInput}
		toGetStatus={getStatus1}
		on:selectionWithAmount={(e) => handleSelectionWithAmount(1, e)}
		on:selectionNoAmount={(e) => handleSelectionNoAmount(1, e)}
		on:inputWithAddress={(e) => handleInputWithAddress(1, e)}
		on:inputNoAddress={(e) => handleInputNoAddress(1, e)}
	/>
</div>

<div class="token-box">
	<TokenBox
		bind:address={address2}
		{updateCurrentInput}
		toGetStatus={getStatus2}
		on:selectionWithAmount={(e) => handleSelectionWithAmount(2, e)}
		on:selectionNoAmount={(e) => handleSelectionNoAmount(2, e)}
		on:inputWithAddress={(e) => handleInputWithAddress(2, e)}
		on:inputNoAddress={(e) => handleInputNoAddress(2, e)}
	/>
</div>
