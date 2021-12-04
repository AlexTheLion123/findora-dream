<script lang="ts">
	import { getExactSwapData, getDollarValue, getRoute } from '$lib/scripts/Exchange/Swap';
	import type { Bytes32, Uint256, Uint32, Address } from 'soltypes';
	import TokenBox from './TokenBox.svelte';

	let token1Address: Address; // address
	let token2Address: Address; // address
	let numTokens1: number;
	let numTokens2: number;
	let dollars1 = 0.0;
	let dollars2 = 0.0;

	/**
	 * Event handlers
	 * There are four events:
	 * 1. Token 1 selected
	 * 2. Token 2 selected
	 * 3. Token 1 input
	 * 4. Token 2 input
	 *
	 */

	async function handleSelection1(e) {
		token1Address = e.detail.address;
		console.log(token1Address);

		if (numTokens1) {
			// need to work out dolars again since different token
			dollars1 = await getDollarValue(token1Address, numTokens1); // TODO remove await, can handle async

			if (token2Address) {
				const route = await getRoute(token1Address, token2Address);
				numTokens2 = await getExactSwapData(token1Address, token2Address, numTokens1, 0, route);
                dollars2 = await getDollarValue(token2Address, numTokens2)
			}
		} else if (token2Address && numTokens2) {
			// no point in getting route separately if no inputs but both selected
			const route = await getRoute(token1Address, token2Address);
			numTokens1 = await getExactSwapData(token1Address, token2Address, 0, numTokens2, route);
            dollars1 = await getDollarValue(token1Address, numTokens1)

		}
	}

	async function handleSelection2(e) {
		token2Address = e.detail.address;
		console.log(token2Address);

		if (numTokens2) {
			// need to work out dolars again since different token
			dollars2 = await getDollarValue(token2Address, numTokens2); // TODO remove await, can handle async

			if (token1Address) {
				const route = await getRoute(token1Address, token2Address);
				numTokens1 = await getExactSwapData(token1Address, token2Address, 0, numTokens2, route);
                dollars1 = await getDollarValue(token1Address, numTokens1)
			}
		} else if (token1Address && numTokens1) {
			// no point in getting route separately if no inputs but both selected
			const route = await getRoute(token1Address, token2Address);
			numTokens2 = await getExactSwapData(token1Address, token2Address, numTokens1, 0, route);
            dollars2 = await getDollarValue(token2Address, numTokens2)
		}
	}

	async function handleInput1(e) {
		numTokens1 = e.detail.numTokens;
		console.log(numTokens1);

		if (token1Address) {
			// token 1 selected
			dollars1 = await getDollarValue(token1Address, numTokens1);

			if (token2Address) {
				// token 2 also selected, then we can go ahead and get all data
				const route = await getRoute(token1Address, token2Address);
				numTokens2 = await getExactSwapData(token1Address, token2Address, numTokens1, 0, route);
				dollars2 = await getDollarValue(token2Address, numTokens2);
			}
		}

		// we don't care if only token2 is selected this is handled by token2 selection event
		// And of course, we also don't care if neither are selected.
	}

	async function handleInput2(e) {
		numTokens2 = e.detail.numTokens;
		console.log(numTokens2);

		if (token2Address) {
			// token 2 selected, otherwise can't do anything
			dollars2 = await getDollarValue(token2Address, numTokens2);

			if (token1Address) {
				const route = await getRoute(token1Address, token2Address);
				numTokens1 = await getExactSwapData(token1Address, token2Address, 0, numTokens2, route);
				dollars1 = await getDollarValue(token1Address, numTokens1);
			}
		}
	}

	
</script>

<div class="token-box">
	<TokenBox
		on:tokenSelected={handleSelection1}
		on:tokenNumInput={handleInput1}
		dollars={dollars1}
		numTokens={numTokens1}
	/>
</div>

<div class="token-box">
	<TokenBox
		on:tokenSelected={handleSelection2}
		on:tokenNumInput={handleInput2}
		dollars={dollars2}
		numTokens={numTokens2}
	/>
</div>

<style>
</style>
