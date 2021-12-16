<script lang="ts">
    export let link: string;
    export let text: string;
</script>

<a href={link}>{text}</a>

<style lang="scss">
	$background: linear-gradient(to right, rgb(251, 255, 0), rgb(255, 102, 0), rgb(255, 0, 255));

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