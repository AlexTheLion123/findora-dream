<script context="module" lang="ts">
	let current: HTMLInputElement | undefined;

	const elements: Set<HTMLInputElement> = new Set();

	function clearAll() {
		elements.forEach(element => {
			element.value = ''
		})
	}
</script>

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let updateCurrentInput: boolean;
	export let amount: number;

	let inputElement: HTMLInputElement;
	const dispatch = createEventDispatcher();
	
	async function handleInput() {
		updateCurrentInputElement();

		if(!amount) {
			await dispatch("clearAll");
			clearAll();
			return;
		}

		dispatch('amountInput');
	};

	function updateCurrentInputElement() {
		if (!updateCurrentInput) {
			return;
		}
		if (current && current !== inputElement) {
			current.value = '';
		}
		current = inputElement;
	}

	onMount(() => {
		inputElement.value = '';
		elements.add(inputElement)
	});
</script>

<input
	type="number"
	placeholder="0.00"
	bind:value={amount}
	bind:this={inputElement}
	on:input={handleInput}
/>

<style>
	input {
		all: unset;
		font-size: 30px;
		color: white;
		text-align: right;
		width: 100%;
	}
</style>
