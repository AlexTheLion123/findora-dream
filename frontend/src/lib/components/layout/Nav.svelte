<script>
	import { page } from '$app/stores';
</script>

<nav>
	<a class="item" href="/" class:selected={$page.path == '/'}>Dashboard</a>
	<a class="item" href="/swap" class:selected={$page.path == '/swap'}>Swap</a>
	<a class="item" href="/liquidity" class:selected={$page.path == '/liquidity'}>Liquidity</a>
	<a class="item" href="/farms" class:selected={$page.path == '/farms'}>Farms</a>
	<a class="item" href="/staking" class:selected={$page.path == '/staking'}>Staking</a>
	<a class="item" href="/vaults" class:selected={$page.path == '/vaults'}>Vaults</a>
	<div class="item-box" href="/lending">
		<div class="top-item">Lending</div>
		<ul>
			<a>Deposit</a>
			<a>Borrow</a>
		</ul>
	</div>
	<a class="item" href="/fire">Fire & Ice</a>
	<a
		class="item"
		href="http://dev-chainbridge.s3-website-us-west-2.amazonaws.com/transfer"
		target="_blank"
		>Bridge ext
	</a>
	<a
		class="item"
		href="http://dev-chainbridge.s3-website-us-west-2.amazonaws.com/transfer"
		target="_blank"
		>Dashboard ext
	</a>
</nav>

<style lang="scss">
	$nav-background: none; // TODO remove
	$nav-border-right: 1px solid rgba(105, 105, 206, 0.5);

	$a-radius: 15px;
	$a-hover-border: 3px solid rgba(255, 255, 255, 0.3);
	
	$a-selected-border: none;
	$a-selected-background: rgba(88, 111, 139, 0.555);

	.selected {
		background: $a-selected-background;
		border: $a-selected-border;
		border-radius: $a-radius;
	}

	nav {
		border-right: $nav-border-right;
		height: 100%;
		padding: 0 20px;
		a {
			color: inherit;
			&:hover {
				// background: lighten($btn-color, 10%);
				cursor: pointer;

				border-radius: $a-radius;
				border: $a-hover-border;
			}
		}

		.item,
		.top-item {
			width: 100%;
			padding: 20px 0 20px 40px;

			text-decoration: none;
			display: block;
		}

		.item-box {
			ul {
				margin-left: 50px;
				list-style: none;

				a {
					padding: 10px;
					display: block;
				}
				
			}
		}
	}
</style>
