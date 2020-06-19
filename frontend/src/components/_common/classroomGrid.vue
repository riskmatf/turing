<template>
	<div class="row">
		<template v-for="classroom in classroomList">
			<slot :classroom="classroom"></slot>
		</template>
	</div>
</template>

<style lang="sass" scoped>
	.row
		display: flex
		flex-direction: row
		flex-wrap: wrap
</style>

<script>
	export default {
		props: {
			classroomList: {
				type: Array,
				default() {
					return []
				},
			},
		},
	}
</script>
