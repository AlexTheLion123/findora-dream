<script context="module" lang="ts">
	import { ethers } from 'ethers';
</script>

<script lang="ts">
	// TODO see if we actually use provider for readonly stuff, or just use signer for everything?
	import { isConnected, provider, signer, isProvided, signerAddress } from '$lib/stores';

	import Nav from '$lib/components/layout/Nav.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Background from '$lib/components/layout/Background.svelte';

	isConnected.subscribe(async (value) => {
		if (value) {
			// connected
			$provider = new ethers.providers.Web3Provider(window.ethereum);
			$isProvided = true;

			$signer = $provider!.getSigner();
			$signerAddress = await $signer!.getAddress()
			
			console.log('We are now connected');
		} else {
			$provider = null;
			$signer = null;
			$isProvided = false;
			$signerAddress = null;
		}
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&display=swap"
		rel="stylesheet"
	/>
	<script src="https://kit.fontawesome.com/30f595e84f.js" crossorigin="anonymous"></script>
</svelte:head>

<div class="container">
	<Background />
	<div class="nav"><Nav /></div>
	<header><Header /></header>
	<main><slot /></main>
</div>

<style lang="scss">
	$global-background: none;
	$container-blur: 250px;
	$nav-border-right: 1px solid rgba(105, 105, 206, 0.5);

	:root {
		font-family: 'Inter', sans-serif;
		font-weight: 500;
		color: white;
	}

	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(html),
	:global(body) {
		min-height: 100%;
		height: 100%;
	}

	:global(body) {
		background: $global-background;
	}

	:global(button),
	:global(input[type='submit']),
	:global(input[type='reset']) {
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}

	:global(input::-webkit-outer-spin-button),
	:global(input::-webkit-inner-spin-button) {
		all: unset;
	}

	input[type='number'] {
		-moz-appearance: textfield; /* Firefox */
	}

	:global(.popup-modal-wrapper) {
        z-index: 999;
        position: absolute;
        top: 0;
        right:0;
        bottom:0;
        left:0;
        background: rgba(0,0,0,0.3);

		display: grid;
		place-items: center;
	}

	header {
		height: 70px;
		grid-area: header;
	}

	.container {
		margin: auto;
		width: 100%;
		max-width: 1500px;
		height: 100vh;

		backdrop-filter: blur($container-blur);

		display: grid;

		grid-template:
			'nav header' 1fr
			'nav content' 5fr
			/ minmax(200px, 300px) 3fr;
	}

	.nav {
		height: 100%;
		grid-area: nav;
		border-right: $nav-border-right;
	}

	main {
		height: 100%;
		width: 100%;
		display: grid;
		grid-area: content;
	}
</style>
