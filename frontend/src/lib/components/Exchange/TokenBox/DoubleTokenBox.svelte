<script context="module" lang="ts">
	import { addDecimals, checkSufficientAllowance } from '$lib/scripts/exchange';
	import type { IExchangeContext } from '$lib/typesFrontend';
</script>

<script lang="ts">
	import TokenBox from '../TokenBox/TokenBox.svelte';
	import { getContext } from 'svelte';
	import { createEventDispatcher } from 'svelte';
import PoolInfo from '$lib/components/Exchange/Liquidity/AddLiquidity/PoolInfo.svelte';

	const { signerObj, getRouter }: IExchangeContext = getContext('exchange');
	const signer = signerObj.getSigner();
	const signerAddr = signerObj.getAddress();
	const router = getRouter();

	let currentTokenBox: TokenBox | null;
	let otherTokenBox: typeof currentTokenBox;

	export let status: string;
	export let amount1: number;
	export let amount2: number;
	export let address1: string;
	export let address2: string;
	export let symbol1: string;
	export let symbol2: string;
	export let decimals1: number;
	export let decimals2: number;
	export let approveBoth = false;
	export let updateCurrent2 = false;
	export let updateCurrent1 = false;

	let tokenBox1: TokenBox;
	let tokenBox2: TokenBox;

	const dispatch = createEventDispatcher();

	let updateStatus = (function () {
		let allowance1 = {
			isAllowed: false,
			address: address1
		};
		let allowance2 = {
			isAllowed: false,
			address: address2
		};

		return async function () {
			if (!(address1 && address2)) {
				status = 'select token';
			} else if (address1 && address2 && !(amount1 && amount2)) {
				status = 'enter amount';
			} else if (address1 && address2 && amount1 && amount2) {
				status = await updateAllowanceBoth();
			}

			async function updateAllowanceBoth(): Promise<string> {
				let isAllowed1 = false;
				let isAllowed2 = false;
				
				console.log("in update allowance")

				if (allowance1.address && address1 && allowance1.address === address1) {
					console.log("using allowance cache 1");
					isAllowed1 = allowance1.isAllowed 
				} else {
					isAllowed1 = await checkSufficientAllowanceHelper(1);

					allowance1 = {
						address: address1,
						isAllowed: isAllowed1
					};
				}


				if (approveBoth) {
					if(allowance2.address && address2 && allowance2.address === address2) {
						isAllowed2 = allowance2.isAllowed
						console.log("using allowance cache 1");
					} else {
						isAllowed2 = await checkSufficientAllowanceHelper(2);

						allowance2 = {
							address: address2,
							isAllowed: isAllowed2
						};
					}

				}

				return getStatus();

				function getStatus() {
					if (isAllowed1) {
						if (approveBoth && !isAllowed2) {
							return `approve ${symbol2}`;
						} else {
							return 'action';
						}
					} else {
						return `approve ${symbol1}`;
					}

				}

				async function checkSufficientAllowanceHelper(num: 1 | 2) {
					return num === 1
						? checkSufficientAllowance({
								toSpend: addDecimals(amount1, decimals1),
								ownerAddr: signerAddr,
								spenderAddr: router.address,
								tokenAddr: address1,
								signer: signer
						  })
						: checkSufficientAllowance({
								toSpend: addDecimals(amount2, decimals2),
								ownerAddr: signerAddr,
								spenderAddr: router.address,
								tokenAddr: address1,
								signer: signer
						  });
				}
			}
		};
	})();

	function updateCurrentTokenBox(_tokenBox: TokenBox) {
		if (_tokenBox === tokenBox1) {
			currentTokenBox = tokenBox1;
			otherTokenBox = tokenBox2;
		} else {
			currentTokenBox = tokenBox2;
			otherTokenBox = tokenBox1;
		}
	}

	function getCurrentBox() {
		if (currentTokenBox === tokenBox1) return 1;
		else if (currentTokenBox === tokenBox2) return 2;
		else return 0;
	}

	function handleSelectionWithNumTokens() {
		updateStatus();

		dispatch('selectionWithTokens', {
			num: getCurrentBox()
		});
	}

	function handleSelectionWithoutNumTokens() {
		updateStatus();

		dispatch('selectionWithoutTokens', {
			num: getCurrentBox()
		});
	}
	function handleInputWithAddress(_tokenBox: TokenBox, e: CustomEvent<any>) {
		updateCurrentTokenBox(_tokenBox);
		updateStatus();

		dispatch('inputWithAddress', {
			num: getCurrentBox()
		});
	}
	function handleInputWithoutAddress(_tokenBox: TokenBox) {
		updateCurrentTokenBox(_tokenBox);
		updateStatus();
	}
</script>

<div class="token-box">
	<TokenBox
		bind:this={tokenBox1}
		bind:numTokens={amount1}
		bind:address={address1}
		bind:decimals={decimals1}
		bind:symbol={symbol1}
		updateCurrentInput={updateCurrent1}
		on:tokenSelectedWithNumTokens={(e) => handleSelectionWithNumTokens()}
		on:tokenSelectedWithoutNumTokens={(e) => handleSelectionWithoutNumTokens()}
		on:tokenNumInputWithAddress={(e) => handleInputWithAddress(tokenBox1, e)}
		on:tokenNumInputWithoutAddress={() => handleInputWithoutAddress(tokenBox1)}
	/>
</div>

<div class="token-box">
	<TokenBox
		bind:this={tokenBox2}
		bind:numTokens={amount2}
		bind:address={address2}
		bind:decimals={decimals2}
		bind:symbol={symbol2}
		updateCurrentInput={updateCurrent2}
		on:tokenSelectedWithNumTokens={(e) => handleSelectionWithNumTokens()}
		on:tokenSelectedWithoutNumTokens={(e) => handleSelectionWithoutNumTokens()}
		on:tokenNumInputWithAddress={(e) => handleInputWithAddress(tokenBox2, e)}
		on:tokenNumInputWithoutAddress={() => handleInputWithoutAddress(tokenBox2)}
	/>
</div>
