<script lang="ts">
    export let text:string;
</script>

<button on:click|preventDefault>{text}</button>

<style lang="scss">
    $background: rgba(0, 0, 0, 0.5);

    button {
        background: $background;
        padding: 8px;
        border-radius: 5px;
        width: 100%;

        &:hover {
            background: lighten($background, 10%);
        }
    }
</style>