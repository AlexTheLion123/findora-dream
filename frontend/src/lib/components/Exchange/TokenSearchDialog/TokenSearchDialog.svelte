<script context="module">
	import tokens from '$lib/assets/tokens/tokens.json';
</script>

<script lang="ts">
	import TokenSearchItem from './TokenSearchItem.svelte';
	import { createEventDispatcher } from 'svelte';

	export let whichBox: 1 | 2;

	let lastSelected: number[] = new Array();
	lastSelected[0] = 0; // get correct index programmatically

	let allTokens = tokens.map((item, index) => {
		if (index == 0) {
			// TODO programatically from given address
			return {
				...item,
				selected: true
			};
		}

		return {
			...item,
			selected: false
		};
	});

	const dispatch = createEventDispatcher();

	function clearPrevAndUpdate(index: number) {

		if (whichBox === 1) {
			const i = (lastSelected && lastSelected[0]) ?? index;
			allTokens[i] = { ...allTokens[i], selected: false };
			lastSelected[0] = index;
		} else {
			const i = (lastSelected && lastSelected[1]) ?? index;
			allTokens[i] = { ...allTokens[i], selected: false };
			lastSelected[1] = index;
		}

		allTokens[index] = { ...allTokens[index], selected: true };
		allTokens = allTokens;
	}

	function handleSelection(index: number, e: CustomEvent) {
		clearPrevAndUpdate(index);

		dispatch('selection', e.detail);
	}
</script>

<div class="box">
	<header>
		<input type="text" />
		<i class="fas fa-times" on:click />
	</header>
	<main>
		{#each allTokens as token, i}
			<TokenSearchItem
				name={token.name}
				address={token.address}
				symbol={token.symbol}
				selected={token.selected}
				on:selection={(e) => handleSelection(i, e)}
			/>
		{/each}
	</main>
</div>

<style lang="scss">
	.box {
		height: 70vh;
		width: 450px;
		background: black;
		padding: 20px;
		border-radius: 5px;

		display: flex;
		flex-direction: column;
	}

	::-webkit-scrollbar {
		width: 10px;
		background: rgb(15, 15, 15);
	}

	::-webkit-scrollbar-thumb {
		background: rgb(7, 187, 178);
		border-radius: 5px;
	}

	main {
		margin-top: 20px;
		overflow-y: scroll;
		height: 100%;
	}
	header {
		display: grid;
		grid-template-columns: 1fr 4fr 1fr;

		input {
			all: unset;
			grid-column: 2;
			border: 3px solid rgba(128, 128, 128, 0.3);
			padding: 5px;
			border-radius: 5px;

			&:focus {
				border: 3px solid rgba(77, 0, 128, 0.7);
			}
		}
		i {
			grid-column: -1;

			&:hover {
				cursor: pointer;
			}
		}
	}
</style>
