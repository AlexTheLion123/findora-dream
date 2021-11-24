<script>
    
</script>

<div class="box">
	<div class="title">Swap</div>
	<div class="token-box btn" id="token1">
		<div class="token-left" id="token1-left">
			<span class="token-amount">0.00</span>
			<span class="dollar-amount">12489</span>
		</div>
		<div class="token-right" id="token1-right">
            <span class="symbol">sym</span>
            <span class="balance">0987</span>
        </div>
	</div>
	<div class="token-box btn" id="token2">
		<div class="token-left" id="token2-left">
			<span class="token-amount">0.00</span>
			<span class="dollar-amount">12489</span>
		</div>
		<div class="token-right" id="token2-right">
            <span class="symbol">sym</span>
            <span class="balance">0987</span>
        </div>

	</div>
	<div class="pbox">
		<div class="btn pbtn" id="p1">25%</div>
		<div class="btn pbtn" id="p2">50%</div>
		<div class="btn pbtn" id="p3">75%</div>
		<div class="btn pbtn" id="p4">100%</div>
	</div>
	<div class="swap-btn btn">Swap</div>
</div>

<style lang="scss">
	$radius: 10px;
	$pbtn-color: aliceblue;
	$swap-btn-color: orange;

	.box {
		height: 500px;
		width: 500px;
		background: rgb(61, 61, 61);

		border-radius: 20px;

		display: grid;
		grid-template:
			'. title  ...... ...... ...... .' 1fr
			'. token1 token1 token1 token1 .' 3fr
			'. token2 token2 token2 token2 .' 3fr
			'. pbox   pbox   pbox   pbox   .' 2fr
			'. btn    btn    btn    btn    .' 2fr
			/ 2fr 3fr 3fr 3fr 3fr 2fr;

		.title {
			grid-area: title;

			display: flex;
			align-items: center;
		}

		#token1 {
			background: rgb(75, 71, 71);
			grid-area: token1;
		}

		#token2 {
			background: grey;
			grid-area: token2;
		}

		.pbox {
			grid-area: pbox;

			display: flex;
			justify-content: space-around;
			align-items: center;
		}

		.swap-btn {
			grid-area: btn;
			background: $swap-btn-color;
			margin: 0 0 20px 0;

			display: grid;
			place-items: center;

			&:hover {
				background: lighten($swap-btn-color, 10%);
				cursor: pointer;
			}
		}

		.btn {
			border-radius: $radius;
		}
		.pbtn {
			border: 1px solid black;
			padding: 10px;
			background: $pbtn-color;

			&:hover {
				background: lighten($pbtn-color, 10%);
				cursor: pointer;
			}
		}

		.token-box {
			display: flex;
            align-items: center;
			justify-content: space-between;
		}

		span {
			display: block;
		}
	}
</style>
