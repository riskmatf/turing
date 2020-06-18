<template>
	<div class="legend">
			<div>
				<img src='@/assets/yellowSign.svg' alt="yellowSign">
			</div>
			<div class="text">
				Za popravku
			</div>
			<div class="tabsp">
				<img src='@/assets/redSign.svg' alt="redSign">
			</div>
			<div class="text">
				Izbačen iz upotrebe
			</div>
	</div>
</template>

<style lang="sass" scoped>
	.legend
		display: flex
		flex-direction: row
		padding-left: 5px
		justify-content: center
	.text
		padding-top: 5px
		padding-left: 5px
	.tabsp
		padding-left: 25px

</style>

<script>
	export default {
		name: 'schema-legend',
	}
</script>

