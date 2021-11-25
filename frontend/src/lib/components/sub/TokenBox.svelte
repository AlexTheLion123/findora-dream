<script>
    export let name; // abbreviation
    
</script>


<div class="box">
    <div class="box-left">
        <button class="symbol">sym</button>
        <span class="balance">0987</span>
    </div>
    <div class="box-right">
        <span class="token-amount">0.00</span>
        <span class="dollar-amount">12489</span>
        
    </div>
</div>


<style lang="scss">
    $background: rgb(109, 109, 109);
    $radius: 10px;

    .box {
        display: flex;
        align-items: center;
        justify-content: space-between;

        background: $background;
        width: 100%;
        height: 100%;

        border-radius: $radius;
        border: 1px solid black;
    }

    span {
        display: block;
    }
</style>