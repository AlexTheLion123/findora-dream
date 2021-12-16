<script lang="ts">
	import TradeButton from '../../TradeButton.svelte';
	import Positions from './Positions.svelte'
	import ImportTokens from './ImportTokens.svelte';

	export let showAddLiquidity: boolean;
	
</script>

	<Positions/>	
	<ImportTokens/>
	<TradeButton text="Add Liquidity" on:perfomAction={() => (showAddLiquidity = true)}/>

<style lang="scss">

	.position:not(:first-of-type) {
		margin-top: 10px;
	}

	.importTokens {
		text-align: center;

		background: rgba(255, 255, 255, 0.2);
		border-radius: 10px;
		padding: 20px;
		margin: 20px 0;

		a {
			text-decoration: none;
			color: rgb(128, 247, 251);
			&:hover {
				text-decoration: underline;
			}
		}
	}

</style>
