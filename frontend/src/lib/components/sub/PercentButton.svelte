<script>
	export let text;

</script>

<button>{text}</button>

<style lang="scss">
    $button-background: rgba(171, 171, 224, 0.2);
    $radius: 5px;

	button {
		border-radius: $radius;
		padding: 10px;
		background: $button-background;

		&:hover {
			background: lighten($button-background, 10%);
			cursor: pointer;
		}
	}
</style>
