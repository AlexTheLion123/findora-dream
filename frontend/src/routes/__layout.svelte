<script lang="ts">
	import WalletBtn from '$lib/components/WalletBtn.svelte';
</script>

<svelte:head>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito&display=swap" />
	<script src="https://kit.fontawesome.com/30f595e84f.js" crossorigin="anonymous"></script>
</svelte:head>

<header>
	<div class="header-wrapper">
		<WalletBtn />
	</div>
</header>

<div class="container">
    <nav>
        <div class="item">
            Swap
        </div>
        <div class="item">
            Liquidity
        </div>
        <div class="item">
            Farms
        </div>
        <div class="item">
            Pools
        </div>
        <div class="item">
            Bridge
        </div>
    </nav>

    <main>
        <slot />
    </main>
</div>

<style lang="scss">
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(html) {
		height: 100%;
		font-family: 'Nunito';
	}

	:global(body) {
		/* font: 16px/1.6em -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"; */
        background: black;
		height: 100%;
	}

    :global(#svelte) {
        height: 100%;
    }

    header {
		height: 100px;
		width: 100%;
		background: black;

		.header-wrapper {
			height: 100%;
			width: 100%;

			display: flex;
			align-items: center;
			justify-content: flex-end;
		}
	}

    .container {
        margin: auto;
        width: 100%;
        max-width: 2000px;
        height: 100%;
        background: grey;

        display: flex;
    }

	nav {
        height: 100%;

        flex: 1 1 20%;
        max-width: 300px;

        background: grey;
    }

    main {
        height: 100%;
        
        flex: 3 1 80%;

        background: aliceblue;
    }


</style>
