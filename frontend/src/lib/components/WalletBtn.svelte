<script lang="ts" context="module">
	declare global {
		interface Window { ethereum: any}
	}
</script>

<script lang="ts">
	import { isConnected } from '../stores';

	

	function connect() {
		if ($isConnected) {
			// do nothing if already connected
			alert("Already connected") // TODO remove
			return;
		}

		if (typeof window.ethereum !== 'undefined') {
			alert('MetaMask is installed!');

			$isConnected = true;
		} else {
			alert("Please install metamask")
		}
	}
</script>

<div id="connect" on:click={connect}>Connect Wallet</div>

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
