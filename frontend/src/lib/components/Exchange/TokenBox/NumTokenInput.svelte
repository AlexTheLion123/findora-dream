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

	let inputElement: HTMLInputElement;

	export let updateCurrentInput: boolean;

	let value: number;

	const dispatch = createEventDispatcher();
	
	const handleInput = function () {
		updateCurrentInputElement();

		if(!value) {
			clearAll();
			return;
		}

		dispatch('amountInput', { amount: inputElement.value });
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
	bind:this={inputElement}
	placeholder="0.00"
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
