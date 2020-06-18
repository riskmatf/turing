<template>
	<div class="fas fa-check" :class="{ 'text-success': solved, 'not-active': !solved }"></div>
</template>

<style lang="sass" scoped>
	.not-active
		color: #A3A3A3
</style>

<script>
	export default {
		props: {
			solved: Boolean,
		},
	}
</script>

