<script>

</script>


<div class="box">
    <header>Initial prices and pool share</header>
    <div class="info">
        <span class="rate1">0</span>
        <span class="rate2">1</span>
        <span class="pool-share">0.03%</span>
    </div>
</div>



<style lang="scss">
    $box-background: rgb(92, 81, 81);
    $box-radius: 20px;

    .box {
        height: 100%;
        width: 100%;
        background: $box-background;
        border-radius: $box-radius;

        header {
            height: 30%;
            margin-left: 20px;

            display: flex;
            align-items: center;
        }

        .info {
            height: 70%;

            display: flex;
            align-items: center;
            justify-content: space-around;
        }
    }
</style>