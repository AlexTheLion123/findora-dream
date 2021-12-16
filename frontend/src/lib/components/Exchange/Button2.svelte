<script lang="ts">
    export let text:string;
</script>

<button on:click|preventDefault>{text}</button>

<style>
    button {
        background: lightseagreen;
        padding: 5px;
        border-radius: 5px;
    }
</style>