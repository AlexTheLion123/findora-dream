<script>
	export let text;
</script>

<button>{text}</button>

<style lang="scss">
	$button-border: 1px solid black;
    $button-color: rgb(171, 171, 224);
    $radius: 10px;

	button {
		border: $button-border;
		border-radius: $radius;
		padding: 10px;
		background: $button-color;

		&:hover {
			background: lighten($button-color, 10%);
			cursor: pointer;
		}
	}
</style>
