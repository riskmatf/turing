<template>
    <div>
        <page-header>
            <breadcrumbs :paths="breadcrumbData" class="breadcrumbs"/>
            <div class="positioner">
                <el-button size="mini">Dodaj ucionicu</el-button>
            </div>
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
                            <classroom :classroom="classroom" class="classroom" 
                                :key="classroom.name" @change="fetchAllClassrooms"/>
                        </template>
                    </classroom-grid>
                </el-collapse-item>
            </el-collapse>
        </div>
        <template v-else-if="request.status === 'loading'">
            <div class="loading">
                Loading...
            </div> 
        </template>
        <div v-else-if="request.status === 'error'" class="text-danger">
            Error: {{ request.message }}
        </div>
    </div>
</template>

<style lang="sass" scoped>
    @import "./src/assets/styles/breakPoints"
    
    .breadcrumbs
        margin-top: 5px
        margin-bottom: 5px
        margin-left: 2px
    .positioner
        display: flex
        flex-direction: row
        justify-content: flex-end
        padding-right: 5px
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
            PageHeader,
            Classroom,
        },
        computed: {
            breadcrumbData() {
                return [
                        { name: 'pocetna', to: {name: 'adminHomePage'}},
                        { name: 'ucionice', to: { name: 'adminClassroomListPage' } }
                       ]
            },
            ...mapGetters('Admin/Classroom/AllClassrooms', ['classroomsGroupedByLocation']),
            ...mapState('Admin/Classroom/AllClassrooms', ['request']),
        },
        methods: {
            ...mapActions('Admin/Classroom/AllClassrooms', ['fetchAllClassrooms']),
        },
        created() {
            if (this.request.status === 'loading') {
                return
            }
            this.fetchAllClassrooms()
        }
    }
</script>