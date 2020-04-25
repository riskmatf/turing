<template>
    <el-tooltip v-model="visible" :content="activeText" placement="top-start" manual> 
        <el-switch v-model="model" @click.native="showTooltip"/>
    </el-tooltip>
</template>

<style lang="sass" scoped>

</style>

<script>
    import _ from 'lodash'

    export default {
        props: {
            value: Boolean,
            readonly: Boolean,
            yesText: String,
            noText: String,
        },
        data() {
            return {
                visible: false,
            }
        },
        computed: {
            model: {
                get() {
                    return this.value
                },
                set(val) {
                    if (!this.readonly) {
                        this.$emit('input', val)
                    }
                }
            },
            activeText() {
                return this.model ? this.yesText : this.noText
            },
        },
        methods: {
            showTooltip() {
                if (!_.isNil(this.timeout)) {
                    clearTimeout(this.timeout)
                    this.timeout = null
                }   
                this.visible = true 
                this.timeout = setTimeout(() => {this.visible = false}, 1000)
            },
        },
    }
</script>