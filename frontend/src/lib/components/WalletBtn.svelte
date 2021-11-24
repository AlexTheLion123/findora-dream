<script lang="ts" context="module">
	declare global {
		interface Window {
			ethereum: any;
		}
	}

	declare let ethereum: any;
</script>

<script lang="ts">
	import { onMount, update_await_block_branch } from 'svelte/internal';

	import { isConnected } from '../stores';
	import { currentAccount } from '../stores';
	import { chainId } from '../stores';

	const INSTALL_MSG = "Click here to install metmask"

	let btnText;
	let chainId;
	let isChainRight = true;

	async function initialize() {
		if ($isConnected) {
			// do nothing if already connected
			alert('Already connected'); // TODO remove
			return;
		}

		if (typeof window.ethereum !== 'undefined') {
			if (!ethereum.isMetaMask) {
				alert('You will now be redirected to metamask installation');
				onboard();
				return;
			}

			// Handle chain (network) and chainChanged
			await ethereum
				.request({ method: 'eth_chainId' })
				.then((_chainId) => {
					handleChainChanged(_chainId);
				})
				.catch(console.log);
				ethereum.on('chainChanged', handleChainChanged);

			if (isChainRight === false) {
				return;
			}

			// get current account and set connected to true
			await ethereum
				.request({ method: 'eth_requestAccounts' })
				.then((accounts) => handleAccountsChanged(accounts))
				.catch(console.log);
			ethereum.on('accountsChanged', handleAccountsChanged); // TODO this event is emmitted on page load, change logic to allow instant connection
		} else {
			alert("You will now be redirected to install metamask");
			onboard();
		}
	}

	function onboard() {
		alert("onboard them!")
	}

	function updateMeta(_curAccount) {
		if (_curAccount) {
			$isConnected = true;
			$currentAccount = _curAccount;
			btnText = $currentAccount;
		} else {
			$isConnected = false;
			$currentAccount = null;

			if(window.ethereum) {
				btnText = ethereum.isMetaMask ? "Connect wallet" : "Please install Metamask"
			} else {
				btnText = "Connect wallet"
			}
		}
	}

	function handleChainChanged(_chainId) {
		if (_chainId !== '0x1') {
			// make sure it's ethereum
			alert('We only support ethereum mainnet, please change the network');
			updateMeta(null);
			isChainRight = false;
		} else {
			isChainRight = true;
		}
	}

	function handleAccountsChanged(accounts: String[]) {
		if (accounts.length === 0) {
			// Metamask is (or has been) locked or the user has not connected (or disconnected) any accounts
			alert('Please connect to metamask');
			updateMeta(false);
		} else if (accounts[0] !== $currentAccount) {
			// user simply changed account
			updateMeta(accounts[0]);
		}
	}

	// change button text according to connection status
	
	
	// $: if ($currentAccount) {
	// 	btnText = $currentAccount;
	// } else {
	// 	if(window.ethereum) {

	// 	}
	// 	btnText = ethereum.isMetaMask ? 'Connect Wallet' : 'Click here to install metamask';
	// }

	onMount(() => {
		updateMeta(null)	
	})
</script>

<div id="connect" on:click={initialize}>{btnText}</div>

<style lang="scss">
	$btn-color: grey;

	#connect {
		background: $btn-color;

		padding: 30px;
		margin: 0 50px;
		border-radius: 10px;

		&:hover {
			background: lighten($btn-color, 10%);
			cursor: pointer;
		}
	}
</style>
