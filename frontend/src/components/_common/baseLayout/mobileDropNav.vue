<template>
    <div>
        <el-button size="mini" @click="toggleDropDown">
            Drop
        </el-button>
        <div class="dropdown" :class="dropDownClass">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="sass" scoped>
    @import "src/assets/styles/variables"
    @import "src/assets/styles/colors"

    .dropdown
        position: absolute
        left: 0
        width: 100%
        background-color: $el-background-color
        height: 0
        transition: height 0.5s linear
        overflow: hidden
        display: flex
        flex-direction: column
        align-items: flex-end
        &.open
            height: calc(100% - #{$topBarHeight})

</style>

<script>
    import { Button } from 'element-ui'
    export default {
        name: 'mobile-drop-nav',
        components: {
            ElButton: Button
        },
        data() {
            return {
                dropDownOpen: false
            }
        },
        methods: {
            toggleDropDown() {
                this.dropDownOpen = !this.dropDownOpen
            }
        },
        computed: {
            dropDownClass() {
                return {
                    open: this.dropDownOpen
                }
            }
        },
        watch: {
            $route() {
                this.dropDownOpen = false
            },
        }
    }
</script>