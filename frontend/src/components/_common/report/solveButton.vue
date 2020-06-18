<template>
	<el-button size="mini" :disabled="disabled" @click="$emit('click')">Popravi kvar</el-button>
</template>

<style lang="sass" scoped>

</style>

<script>
	export default {
		props: {
			disabled: Boolean,
		}
	}
</script>
