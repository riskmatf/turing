<template>
    <div class="column full">
        <el-menu
            :default-active="$route.meta.index"
            mode="horizontal"
            router
            class="desktop topBar"
            active-text-color="#409EFF"
        >
            <el-menu-item index="0" :route="{ name: targetHomePage }">
                Turing logo
            </el-menu-item>
            <div class="spacer"></div>
            <slot name="topBar"/>
        </el-menu>

        <div class="topBar mobile">
            <el-menu
                :default-active="$route.meta.index"
                mode="horizontal"
                router
                class="mobile topBar"
                active-text-color="#409EFF"
                @select="handleSelect"
            >
                <el-menu-item index="0" :route="{ name: targetHomePage }">
                    Turing logo
                </el-menu-item>
                <div class="spacer"></div>
                <el-button size="mini" @click="isOpen = !isOpen">=</el-button>
            </el-menu>
        </div>

        <div class="column full body-padding">
            <el-popover
                v-model="isOpen"
                trigger="manual"
                popper-class="topbar-dropdown mobile"
                :append-to-body="false"
                :visible-arrow="false"
            >
                <el-menu
                    :default-active="$route.meta.index"
                    router
                    active-text-color="#409EFF"
                    @select="handleSelect"
                >
                    <slot name="topBar"/>
                </el-menu>
            </el-popover>
            <slot name="body"></slot>
        </div>
    </div>
</template>


<style lang="sass" scoped>
    @import "./src/assets/styles/breakPoints"
    @import "./src/assets/styles/variables"
    @import "./src/assets/styles/colors"

    .column
        display: flex
        flex-direction: column
        &.full
            height: 100%
            overflow-y: auto
    .row
        display: flex
        flex-direction: row
    .topBar
        width: 100%
        display: flex
        flex-direction: row
        justify-content: space-between
        align-items: center
        .spacer
            flex-grow: 1
    .mobile
        display: none
        @media ($mobileBreakPoint)
            display: flex
    .desktop
        display: flex
        @media ($mobileBreakPoint)
            display: none
    .home-logo
        margin: 2px
        cursor: pointer
    .body-padding
        padding-left: 5px
        padding-right: 5px
</style>

<style lang="sass">
    @import "./src/assets/styles/colors"

    html, body
        height: 100%
        padding: 0
        margin: 0
        background-color: $background-color

    .topbar-dropdown
        width: 100%
        height: 100%
        padding: 0!important
        margin: 0!important
        margin-left: -5px!important
        box-sizing: border-box

</style>

<script>
    export default {
        name: 'base-layout',
        components: {
        },
        props: {
            targetHomePage: String,
        },
        data() {
            return {
                isOpen: false
            }
        },
        methods: {
            handleSelect() {
                this.isOpen = false
            },
        }
    }
</script>