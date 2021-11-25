<script lang="ts">
	import Nav from '$lib/components/layout/Nav.svelte';
	import Header from '$lib/components/layout/Header.svelte';
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

<div class="all">
	<header>
		<Header />
	</header>

	<div class="container">
		<div class="nav"><Nav /></div>
		<main><slot /></main>
	</div>
</div>

<style lang="scss">
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

	:global(html) {
		height: 100%;
	}

	:global(body) {
		/* font: 16px/1.6em -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"; */
		height: 100%;
	}

	:global(#svelte) {
		height: 100%;
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

	.all {
		min-height: 100vh;
		min-width: 100vh;
		background: linear-gradient(to right top, #080b1aff, #061437ff);
	}

	header {
		height: 100px;
		width: 100%;
	}

	.container {
		margin: auto;
		width: 100%;
		max-width: 2000px;
		height: 100vh;

		display: flex;
	}

	.nav {
		height: 100%;

		flex: 1 1 20%;
		min-width: 200px;
		max-width: 300px;
	}

	main {
		height: 100%;

		flex: 3 1 80%;

		display: grid;
	}
</style>
