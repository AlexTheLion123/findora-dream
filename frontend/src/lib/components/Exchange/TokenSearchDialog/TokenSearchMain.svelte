<script lang="ts">
    import TokenSearchDialog from './TokenSearchDialog.svelte';
    import {createEventDispatcher} from 'svelte';

    export let whichBox: 1 | 2; // TODO change to boolean
    export let showSearchDialog = false;

    const dispatch = createEventDispatcher();

    function hideSearch() {
		showSearchDialog = false;
	}

    function handleSelection(e: CustomEvent) {
        showSearchDialog = false;

        dispatch("selection", e.detail)
    }

</script>

<div class="popup-wrapper" class:hide={!showSearchDialog}>
	<div class="popup-modal">
		<TokenSearchDialog {whichBox} on:selection={handleSelection} on:click={hideSearch} />
	</div>
</div>

<style>
	.popup-wrapper {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 999;

		display: grid;
		place-items: center;
	}

	.popup-modal {
		position: fixed;
		margin-top: -100px;
	}

	.hide {
		display: none;
	}
</style>