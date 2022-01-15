<script lang="ts">
    import TokenSearchDialog from './TokenSearchDialog.svelte';
    import {createEventDispatcher} from 'svelte';

    export let isBox1: boolean; 
    export let showSearchDialog = false;
	export let address1: string;
	export let address2: string;

    const dispatch = createEventDispatcher();

    function hideSearch() {
		showSearchDialog = false;
	}

    function handleSelection(e: CustomEvent) {
        showSearchDialog = false;
		
		if(e.detail?.isBox1){
			dispatch("selection", {...e.detail})
		} else {
			dispatch("selection", {...e.detail, isBox1: isBox1})
		}
		
    }

</script>

<div class="popup-wrapper" class:hide={!showSearchDialog}>
	<div class="popup-modal">
		<TokenSearchDialog {isBox1} {address1} {address2} on:selection={handleSelection} on:click={hideSearch} />
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