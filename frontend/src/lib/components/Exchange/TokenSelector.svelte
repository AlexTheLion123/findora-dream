<script>
    import TokenSearchBox from "./TokenSearchBox.svelte";

    export let name;
    export let logoSrc;

    let showSearch = false
</script>

<button on:click|preventDefault={()=>showSearch=true}>
    <img src={logoSrc} class="symbol" width="35" height="35" alt=""/>
    <p>{name.toUpperCase()}</p>       
    <i class="fas fa-chevron-down"></i>
</button>

{#if showSearch}
    <div class="popup-modal-wrapper">
        <TokenSearchBox bind:isShown={showSearch}/>
    </div>
{/if}

<style>
    button {
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 20px;
        width: 140px;
        height: 50px;
        padding: 15px 15px 15px 5px;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    button:hover {
        background: rgba(255,255,255,0.2);
    }

    .symbol {
        background: rgba(0,0,0,0.2);
        border-radius: 100%;
        box-sizing: content-box;
        padding: 5px;
    }

    
</style>