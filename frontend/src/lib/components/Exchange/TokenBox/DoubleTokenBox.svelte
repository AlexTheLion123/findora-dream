<script lang="ts">
	import TokenBox from '../TokenBox/TokenBox.svelte';
	import { createEventDispatcher } from 'svelte';

	export let address1: string;
	export let address2: string;
	export let amount1: number;
	export let amount2: number;
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

	const dispatch = createEventDispatcher();

	function getToDispatch(num: 1 | 2, e: CustomEvent) {
		let toDispatch = {
			...e.detail,
			tokenBox: num
		};

		return toDispatch;
	}

	function selectionWithAmount(num: 1 | 2, e: CustomEvent) {
		const toDispatch = getToDispatch(num, e);

		dispatch('selectionWithAmount', toDispatch);
	}

	function selectionNoAmount(num: 1 | 2, e: CustomEvent) {
		const toDispatch = getToDispatch(num, e);

		dispatch('selectionNoAmount', toDispatch);
	}
	function inputWithAddress(num: 1 | 2, e: CustomEvent) {
		const toDispatch = getToDispatch(num, e);

		dispatch('inputWithAddress', toDispatch);
	}

	function clearAll() {
		amount1 = 0;
		amount2 = 0;
	}
</script>

<div class="token-box">
	<TokenBox
		bind:address={address1}
		bind:amount={amount1}
		{updateCurrentInput}
		toGetStatus={getStatus1}
		on:selectionWithAmount={(e) => selectionWithAmount(1, e)}
		on:selectionNoAmount={(e) => selectionNoAmount(1, e)}
		on:inputWithAddress={(e) => inputWithAddress(1, e)}
		on:clearAll={clearAll}
	/>
</div>

<div class="token-box">
	<TokenBox
		bind:address={address2}
		bind:amount={amount2}
		{updateCurrentInput}
		toGetStatus={getStatus2}
		on:selectionWithAmount={(e) => selectionWithAmount(2, e)}
		on:selectionNoAmount={(e) => selectionNoAmount(2, e)}
		on:inputWithAddress={(e) => inputWithAddress(2, e)}
		on:clearAll={clearAll}
	/>
</div>
