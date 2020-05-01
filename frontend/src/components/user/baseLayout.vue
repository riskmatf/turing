<template>
    <base-layout targetHomePage="homePage">
        <template v-slot:topBar>
            <el-menu-item index="1" :route="{ name: 'homePage' }">
                Pocetna
            </el-menu-item>

            <el-menu-item index="2" :route="{ name: 'classroomListPage' }">
                Ucionice
            </el-menu-item>

            <el-menu-item index="3" :route="{ name: 'tutorialPage' }" disabled>
                Uputstvo
            </el-menu-item>
        </template>

        <template v-slot:body>
            <router-view/>
        </template>
    </base-layout>
</template>

<style lang="sass" scoped>
    @import "./src/assets/styles/breakPoints"

    .nav-item
        margin: 2px 2px 2px 10px
        @media ($mobileBreakPoint)
            width: 100%
            margin-bottom: 10px
    .nav-button
        @media ($mobileBreakPoint)
            width: 100%
</style>

<script>
    import { BaseLayout } from '@/components/_common/baseLayout'

    export default {
        name: 'user-base-layout',
        components: {
            BaseLayout,
        },
        computed: {
            linkStates() {
                return {
                    homePage: this.$route.name === 'homePage' ? 'primary' : 'default',
                    classrooms: this.$route.name === 'classroomListPage' ? 'primary' : 'default',
                    tutorial: this.$route.name === 'tutorialPage' ? 'primary' : 'default',
                }
            }
        }
    }
</script>
