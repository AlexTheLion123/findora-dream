<script>
</script>

<div class="container">
	<div class="fire box">Fire</div>

	<div class="ice box">Ice</div>
</div>

<style lang="scss">
	$border: 30px;

	.container {
		width: 100%;
		height: 100%;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.box {
		display: grid;
		place-items: center;

		width: 40%;
		height: 300px;
		border: 3px solid white;
		border-radius: 30px;
		margin: 10px;
		color: white;
		font-size: 40px;
		font-weight: 600px;

		transition: all 1s ease;
		&:hover {
			cursor: pointer;
			transform: scale(1.1);
		}
	}

   
</style>
