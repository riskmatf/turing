<template>
    <base-layout>
        <template v-slot:topBar>
            <router-link :to="{ name: 'homePage' }" class="nav-item">
                <el-button :type="linkStates.homePage" size="mini" class="nav-button">Home</el-button>
            </router-link>
            <router-link :to="{ name: 'classroomListPage' }"  class="nav-item">
                <el-button :type="linkStates.classrooms" size="mini" class="nav-button">Classrooms</el-button>
            </router-link>
            <router-link :to="{ name: 'tutorialPage' }"  class="nav-item">
                <el-button :type="linkStates.tutorial" size="mini" class="nav-button">Tutorial</el-button>
            </router-link>
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
    import { Button } from 'element-ui'
    export default {
        name: 'user-base-layout',
        components: {
            BaseLayout,
            ElButton: Button,
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
