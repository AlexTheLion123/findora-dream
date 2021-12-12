<script context="module" lang="ts">
	let current: HTMLInputElement | undefined;
</script>

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	let inputElement: HTMLInputElement;
	let INPUT_BUFFER = 1000; // i.e. only dispatch input event every 2 seconds (2000 milliseconds)
	let isTimeoutLock = false;

	export let value: number;

	const dispatch = createEventDispatcher();
	const handleInput = function() {
		updateCurrentInputElement();

		// TODO just use event timestamp
		if (isTimeoutLock == true) {
			return;
		}

		/**
		 * If called too soon after the last call, checks if there is an event waiting to be dispatched in settimeout
		 * If not, settimeout is set and function is locked so nothing happens until settimeout dispatched
		 * settimeout should be dispatched with latest value
		 */

		isTimeoutLock = true;
		setTimeout(() => {
			dispatch('tokenNumInput', { numTokens: inputElement.value });
			isTimeoutLock = false;
		}, INPUT_BUFFER);
	}

	function updateCurrentInputElement() {
		if (current && current !== inputElement) {
			current.value = '';
		}
		current = inputElement;
	}

	onMount(() => {
		inputElement.value = ""
	})
</script>

<input type="number" bind:value={value} bind:this={inputElement} placeholder="0.00" on:input={handleInput} />

<style>
	input {
		all: unset;
		font-size: 30px;
		color: white;
		text-align: right;
		width: 100%;
	}

	
</style>
