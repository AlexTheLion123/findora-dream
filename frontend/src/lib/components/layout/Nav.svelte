<nav>
	<a class="item" href="/">Dashboard</a>
	<a class="item" href="/swap">Swap</a>
	<a class="item" href="/liquidity">Liquidity</a>
	<a class="item" href="/farms">Farms</a>
	<a class="item" href="/staking">Staking</a>
	<a class="item" href="/vaults">Vaults</a>
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
		target="_blank">Bridge</a
	>
</nav>

<style lang="scss">
	$nav-background: none;
	$btn-color: none;
	$item-border: none;

	nav {
		a {
			color: inherit;
		}

		.item,
		.top-item {
			background: $btn-color;
			width: 100%;
			padding: 20px 0 20px 40px;
			border-bottom: $item-border;

			text-decoration: none;
			display: block;

			&:hover {
				// background: lighten($btn-color, 10%);
				cursor: pointer;
			}
		}

		.item-box {
			border: 1px solid rgba(105, 105, 206, 0.5);

			ul {
				margin-left: 50px;
				list-style: none;

				a {
					border-left: $item-border;
					padding: 10px;
					display: block;
				}

				a:not(:last-child) {
					border-bottom: $item-border;
				}
			}
		}
	}
</style>
