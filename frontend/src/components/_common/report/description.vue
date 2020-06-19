<template>
	<el-input type="textarea" :readonly="readonly" v-model="model" :autosize="autosize" class="area"/>
</template>

<style lang="sass" scoped>
	.area
		width: 100%
</style>

<script>
	import _ from 'lodash'

	export default {
		props: {
			value: String,
			maxRows: Number,
			minRows: Number,
			readonly: Boolean,
		},
		computed: {
			autosize() {
				const result = {}

				if (!_.isNil(this.maxRows)) {
					result.maxRows = this.maxRows
				}
				if (!_.isNil(this.minRows)) {
					result.minRows = this.minRows
				}

				return result
			},
			model: {
				get() {
					return this.value
				},
				set(val) {
					this.$emit('input', val)
				}
			}
		}
	}
</script>
