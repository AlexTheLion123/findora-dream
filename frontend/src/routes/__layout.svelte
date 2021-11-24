<script lang='ts'>
    import WalletBtn from "$lib/components/WalletBtn.svelte";
</script>


<svelte:head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito&display=swap">
    <script src="https://kit.fontawesome.com/30f595e84f.js" crossorigin="anonymous"></script>
</svelte:head>

<header>
    <div class="header-wrapper">
        <WalletBtn/>
    </div>
</header>

<slot />

<style lang="scss">
	:global(body) {
		margin: 0;
        padding: 0;
		/* font: 16px/1.6em -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"; */
		font-family: 'Nunito';
	}

	:global(*) {
		box-sizing: border-box;
	}

	header {
		height: 200px;
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
</style>
