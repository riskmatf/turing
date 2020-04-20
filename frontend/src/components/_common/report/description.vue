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
            readonly: Boolean,
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
                set(val) {
                    this.$emit('input', val)
                }
            }
        }
    }
</script>