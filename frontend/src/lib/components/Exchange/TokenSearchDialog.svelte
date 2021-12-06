<script context="module" lang="ts">
	import tokens from '$lib/assets/tokens/tokens.json';
	import { nativeTokenAddress } from '$lib/stores'

	// TODO add tags property to search token list, all searches should be via tags
	for(let i=0; i<tokens.length; i++){
		if(tokens[i].name === "Native") nativeTokenAddress.set(tokens[i].address);
		break;
	}

</script>

<script lang="ts">
	// TODO look at other moving stuff to module context
	import { createEventDispatcher } from 'svelte';
	import TokenSearchItem from '$lib/components/Exchange/TokenSearchItem.svelte';
    
	export let isShown = false;
	let current: HTMLElement | undefined;

	const dispatch = createEventDispatcher();
	function handleSelection(e: any) {
		if (current) {
			// if another element has already been selected
			current.style.background = 'none';
		}
		current = e.detail.element as HTMLElement; // update current
        current.style.background = "rgb(255, 255, 255, 0.3)";

        dispatch("tokenSelected", e.detail);
	}


</script>

{#if isShown}
	<div class="box">
		<header>
			<input type="text" />
			<i class="fas fa-times" on:click={() => (isShown = false)} />
		</header>
		<main>
			{#each tokens as token}
				<TokenSearchItem
					name={token.name}
					address={token.address}
					symbol={token.symbol}
					on:tokenSelected={handleSelection}
				/>
			{/each}
		</main>
	</div>
{/if}

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
