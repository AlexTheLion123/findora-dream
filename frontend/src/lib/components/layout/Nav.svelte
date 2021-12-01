<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<script src="https://kit.fontawesome.com/30f595e84f.js" crossorigin="anonymous"></script>
</svelte:head>

<nav>
	<section id="home">
		<h4>Home</h4>
		<a class="item" href="/" class:selected={$page.path == '/'}>
			<i class="fab fa-instagram-square" />
			Your positions
		</a>
	</section>
	<section id="Exchange">
		<h4>Exchange</h4>
		<a class="item" href="/swap" class:selected={$page.path == '/swap'}>
			<i class="fab fa-instagram-square" />
			Swap
		</a>
		<a class="item" href="/liquidity" class:selected={$page.path == '/liquidity'}>
			<i class="fab fa-instagram-square" />
			Liquidity
		</a>
	</section>
	<section id="Yield">
		<h4>Yield</h4>
		<a class="item" href="/farms" class:selected={$page.path == '/farms'}>
			<i class="fab fa-instagram-square" />
			Farms
		</a>
		<a class="item" href="/staking" class:selected={$page.path == '/staking'}>
			<i class="fab fa-instagram-square" />
			Staking
		</a>
		<a class="item" href="/vaults" class:selected={$page.path == '/vaults'}>
			<i class="fab fa-instagram-square" />
			Vaults
		</a>
	</section>
	<section id="Prediction">
		<h4>Prediction</h4>
		<a class="item" href="/fireAndIce">
			<i class="fab fa-instagram-square" />
			Fire & Ice
		</a>
	</section>
	<section>
		<h4>Miscellaneous</h4>
		<a
			class="item"
			href="http://dev-chainbridge.s3-website-us-west-2.amazonaws.com/transfer"
			target="_blank"
		>
			<i class="fab fa-instagram-square" />
			Bridge ext
		</a>
		<a
			class="item"
			href="http://dev-chainbridge.s3-website-us-west-2.amazonaws.com/transfer"
			target="_blank"
		>
			<i class="fab fa-instagram-square" />
			Docs ext
		</a>
	</section>
</nav>

<style lang="scss">
	$nav-background: none; // TODO remove

	$a-radius: 5px;
	$a-hover-border: 3px solid rgba(255, 255, 255, 0.3);
	$a-selected-border: none;
	$a-selected-background: rgba(88, 111, 139, 0.555);
	$a-padding: 10px;

	$h4-color: rgba(187, 186, 186, 0.932);

	$icon-color: grey;

	.selected {
		background: $a-selected-background;
		border: $a-selected-border;
		border-radius: $a-radius;
	}

	.fab {
		color: $icon-color;
	}

	nav {
		padding: 0 30px;

		h4 {
			color: $h4-color;
			margin: 25px 0 15px 0;
		}
		a {
			color: inherit;
			&:hover {
				// background: lighten($btn-color, 10%);
				cursor: pointer;

				border-radius: $a-radius;

				border: $a-hover-border;
			}

			padding: $a-padding;

			text-decoration: none;
			display: block;
		}
	}
</style>
