<template>
    <div>
        <page-header>
            <breadcrumbs :paths="breadcrumbData" class="breadcrumbs"/>
        </page-header>
        <div v-if="request.status === 'success'" class="location-container">
            <el-collapse 
                v-for="(classrooms, location) in classroomsGroupedByLocation" 
                :key="location" 
                class="collapse"
            >
                <el-collapse-item :title="location">
                    <classroom-grid :classroomList="classrooms" class="classroom-grid">
                        <template v-slot="{ classroom }">
                            <classroom :classroom="classroom" class="classroom" :key="classroom.name"/>
                        </template>
                    </classroom-grid>
                </el-collapse-item>
            </el-collapse>
        </div>
        <template v-else-if="request.status === 'loading'">
            <div class="loading">
                Učitavanje...
            </div> 
        </template>
        <div v-else-if="request.status === 'error'" class="text-danger">
            Greška: {{ request.message }}
        </div>
    </div>
</template>

<style lang="sass">
    @import "./src/assets/styles/breakPoints"

    .breadcrumbs
        margin-top: 5px
        margin-bottom: 5px
        margin-left: 2px
    .location-container
        display: flex
        flex-direction: column
        align-content: center
        margin-top: 5px
        .collapse
            width: 77%
            padding-left: 10px
            padding-bottom: 5px
            align-self: center
            .classroom-grid
                padding-left: 10px
                justify-content: center
            .classroom
                width: 30%
                margin-right: 10px
                margin-top: 10px
                @media ($mobileBreakPoint)
                    width: 95%
                @media ($middleScreenBreakPoint)
                    width: 45%
        .el-collapse-item__header
            padding-left: 15px
            font-size: 14px
            font-weight: bold
    .loading
        margin: 20px
                
</style>

<script>
    import Breadcrumbs from '@/components/_common/breadcrumbs/breadcrumbs'
    import ClassroomGrid from '@/components/_common/classroomGrid'
    import PageHeader from '@/components/_common/pageHeader'
    import Classroom from './classroom'
    import { mapGetters, mapActions, mapState } from 'vuex'

    export default {
        components: {
            Breadcrumbs,
            ClassroomGrid,
            Classroom,
            PageHeader,
        },
        computed: {
            breadcrumbData() {
                return [
                        { name: 'početna', to: {name: 'homePage'}},
                        { name: 'učionice', to: { name: 'classroomListPage' } }
                       ]
            },
            ...mapGetters('User/Classroom/AllClassrooms', ['classroomsGroupedByLocation']),
            ...mapState('User/Classroom/AllClassrooms', ['request']),
        },
        methods: {
            ...mapActions('User/Classroom/AllClassrooms', ['fetchAllClassrooms'])
        },
        created() {
            if (this.request.status === 'loading') {
                return
            }
            this.fetchAllClassrooms()
        }
    }
</script>