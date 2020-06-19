<template>
	<h3 class="name"> {{ classroomName }} </h3>
</template>

<style lang="sass" scoped>
	@import "./src/assets/styles/breakPoints"

	.name
		margin: 0
</style>

<script>
	export default {
		props: {
			classroomName: String,
		},
	}
</script>
