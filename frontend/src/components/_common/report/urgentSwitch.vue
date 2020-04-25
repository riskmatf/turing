<template>
    <el-switch v-model="model" :active-text="activeText"/>
</template>

<style lang="sass" scoped>

</style>

<script>
    export default {
        props: {
            value: Boolean,
            readonly: Boolean,
            yesText: String,
            noText: String,
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
        }
    }
</script>