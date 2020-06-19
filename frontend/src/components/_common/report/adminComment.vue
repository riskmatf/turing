<template>
	<div>
		<el-input
			v-model="model"
			:readonly="readonly"
			type="textarea"
			:autosize="autosize"
			ref="input"
		/>
	</div>
</template>

<style lang="sass" scoped>

</style>

<script>
	import _ from "lodash";

	export default {
		props: {
			value: String,
			readonly: Boolean,
			maxRows: Number,
		},
		computed: {
			autosize() {
				if (_.isNil(this.maxRows)) {
					return true
				}

				return { maxRows: this.maxRows }
			},
			model: {
				get() {
					return this.value
				},
				set(value) {
					this.$emit('input', value)
				}
			}
		},
		methods: {
			focus() {
				if (!_.isNil(this.$refs.input)) {
					this.$refs.input.focus()
				}
			}
		}
	}
</script>
