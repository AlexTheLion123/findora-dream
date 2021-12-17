<script lang="ts">
    export let link: string;
    export let text: string;
</script>

<a href={link}>{text}</a>

<style lang="scss">
	$background: rgba(0,0,0,0.2);

	a {
		background: $background;
        border-radius: 10px;
		text-decoration: none;
		color: white;
        display: block;
        padding: 10px;
        text-align: center;

		&:hover {
			cursor: pointer;
		}
	}

</style>