<script context="module" lang="ts">
	let current: HTMLInputElement | undefined;
</script>

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	let inputElement: HTMLInputElement;

	export let updateCurrent: boolean = true;
	export let value: number;

	const dispatch = createEventDispatcher();
	const handleInput = function () {
		updateCurrentInputElement();
		dispatch('tokenNumInput', { numTokens: inputElement.value });
	};

	function updateCurrentInputElement() {
		if (!updateCurrent) {
			return;
		}
		if (current && current !== inputElement) {
			current.value = '';
		}
		current = inputElement;
	}

	onMount(() => {
		inputElement.value = '';
	});
</script>

<input
	type="number"
	bind:value
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
