<template>
    <div class="column full">
        <div class="topBar desktop">
            <router-link :to="{ name: 'homePage' }" tag="div">
                <h1 class="home-logo">Turing</h1>
            </router-link>
            <div class="spacer"></div>
            <slot name="topBar"/>
        </div>

        <div class="topBar mobile">
            <div>Turing</div>
            <div class="spacer"></div>
            <mobile-drop-nav>
                <template v-slot>
                    <slot name="topBar"/>
                </template>
            </mobile-drop-nav>
        </div>

        <div class="column full">
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
        display: flex
        flex-direction: row
        justify-content: flex-end
        align-items: center
        background-color: $el-background-color
    .mobile
        display: none
        height: $topBarHeight
        @media ($mobileBreakPoint)
            display: flex
    .desktop
        display: flex
        @media ($mobileBreakPoint)
            display: none
    .spacer
        flex-grow: 2
    .home-logo
        margin: 2px
        cursor: pointer
</style>

<style lang="sass">
    @import "./src/assets/styles/colors"

    html, body
        height: 100%
        padding: 0
        margin: 0
        background-color: $background-color
</style>


<script>
    import MobileDropNav from './mobileDropNav'

    export default {
        name: 'base-layout',
        components: {
            MobileDropNav
        }
    }
</script>