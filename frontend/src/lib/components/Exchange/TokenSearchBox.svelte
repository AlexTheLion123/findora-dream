<script lang="ts">
	export let isShown = false;

	import tokens from '$lib/assets/tokens/src/tokens.json';
</script>

{#if isShown}
	<div class="box">
		<div class="wrapper">
			<header>
				<input type="text" />
				<i class="fas fa-times" on:click={() => (isShown = false)} />
			</header>
			<main>
                
            </main>
		</div>
	</div>
{/if}

<style lang="scss">
	.box {
		height: 70vh;
		width: 500px;
		background: black;

		border-radius: 20px;

		.wrapper {
			padding: 20px;
		}
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
