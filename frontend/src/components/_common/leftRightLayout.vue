<template>
	<div class="layout-content" :class="{'left-card-active': leftCardActive}">
		<el-card class="left" body-style="height: 100%; overflow-y: auto; box-sizing: border-box;">
			<slot name="left"></slot>
		</el-card>

		<el-card class="right" body-style="height: 100%; overflow-y: auto; box-sizing: border-box">
			<slot name="right"></slot>
		</el-card>
	</div>
</template>

<style lang="sass" scoped>
	@import "src/assets/styles/breakPoints.sass"
	.layout-content
		height: 100%
		width: 100%
		display: grid
		grid-template-columns: 1fr 2fr
		grid-column-gap: 20px
		overflow-y: auto
		@media ($mobileBreakPoint)
			grid-template-columns: 0 1fr
			grid-column-gap: 0
			&.left-card-active
				grid-template-columns: 1fr 0
				grid-column-gap: 0
		.left
			height: 100%
			box-sizing: border-box
		.right
			height: 100%
			box-sizing: border-box
</style>

<script>
	export default {
		props: {
			leftCardActive: Boolean,
		},
	}
</script>
