<script>
	export let text;
	export let color = "orange";
</script>

<button type="submit" style="background: {color}">
	{text}
</button>

<style lang="scss">
	$background: orange;

	button {
		display: grid;
		place-items: center;

		height: 50px;
		width: 100%;
		background: $background;

		border-radius: 10px;

		&:hover {
			cursor: pointer;
			background: lighten($background, 10%);
		}
	}
</style>
