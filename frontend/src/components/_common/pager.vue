<template>
    <div class="pager">
        <div class="controls">
            <el-button size="mini" :disabled="disableBackButtons" @click="model = 1">
                <span class="fas fa-angle-double-left"/>
            </el-button>
            <el-button size="mini" :disabled="disableBackButtons" @click="model = model - 1">
                <span class="fas fa-angle-left"/>
            </el-button>
            <div>{{ model }} / {{ maxPage }}</div>
            <el-button size="mini" :disabled="disableForwardButtons" @click="model = model + 1">
                <span class="fas fa-angle-right"/>
            </el-button>
            <el-button size="mini" :disabled="disableForwardButtons" @click="model = maxPage">
                <span class="fas fa-angle-double-right"/>
            </el-button>
        </div>
        <div class="page">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="sass" scoped>
    .pager
        height: 100%
        display: grid
        grid-template-rows: auto 1fr
        overflow-y: auto
        .controls
            display: grid
            grid-template-columns: repeat(5, max-content)
            grid-column-gap: 10px
            justify-content: center
            align-items: baseline
            & > *
                margin: 0
        .page
            overflow-y: auto
            height: 100%
</style>

<script>
    export default {
        props: {
            value: Number,
            maxPage: Number,
            disablePaging: Boolean,
        },
        computed: {
            model: {
                get() {
                    return this.value
                },
                set(value) {
                    this.$emit('input', value)
                    this.$emit('change')
                }
            },
            hasNextPage() {
                return this.model !== this.maxPage
            },
            hasPrevPage() {
                return this.model !== 1
            },
            disableForwardButtons() {
                return this.disablePaging || !this.hasNextPage
            },
            disableBackButtons() {
                return this.disablePaging || !this.hasPrevPage
            },
        }
    }
</script>