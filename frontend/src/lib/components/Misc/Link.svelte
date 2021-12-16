<script lang="ts">
    export let link: string;
    export let text: string;
</script>

<a href={link}>{text}</a>

<style lang="scss">
	a {
		text-decoration: none;
		color: rgb(128, 247, 251);
		&:hover {
			text-decoration: underline;
			cursor: pointer;
		}
	}
</style>
