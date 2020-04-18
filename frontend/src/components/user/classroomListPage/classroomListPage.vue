<template>
    <div>
        <breadcrumbs :paths="breadcrumbData"/>
        <div v-if="request.status === 'success'" class="location-container">
            <el-collapse 
                v-for="(classrooms, location) in classroomsGroupedByLocation" 
                :key="location" 
                class="collapse"
            >
                <el-collapse-item :title="location">
                    <classroom-grid :classroomList="classrooms" class="classroom-grid">
                        <template v-slot="{ classroom }" >
                            <classroom :classroom="classroom" class="classroom" :key="classroom.name"/>
                        </template>
                    </classroom-grid>
                </el-collapse-item>
            </el-collapse>
        </div>
        <template v-else-if="request.status === 'loading'">
            Loading... 
        </template>
        <div v-else-if="request.status === 'error'" class="text-danger">
            Error: {{ request.message }}
        </div>
    </div>
</template>

<style lang="sass">
    @import "./src/assets/styles/breakPoints"

    .location-container
        display: flex
        flex-direction: column
        align-content: center
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

                
</style>

<script>
    import Breadcrumbs from '@/components/_common/breadcrumbs/breadcrumbs'
    import Classroom from './classroom'
    import { mapGetters, mapActions, mapState } from 'vuex' 
    import ClassroomGrid from '@/components/_common/classroomGrid'

    export default {
        name: 'classroom-list-page',
        components: {
            Breadcrumbs,
            ClassroomGrid,
            Classroom,
        },
        computed: {
            breadcrumbData() {
                return [
                        { name: 'home', to: {name: 'homePage'}},
                        { name: 'classrooms', to: { name: 'classroomListPage' } }
                       ]
            },
            ...mapGetters('Classroom/AllClassrooms', ['classroomsGroupedByLocation']),
            ...mapState('Classroom/AllClassrooms', ['request']),
        },
        methods: {
            ...mapActions('Classroom/AllClassrooms', ['fetchAllClassrooms'])
        },
        created() {
            if (this.request.status === 'loading') {
                return
            }
            this.fetchAllClassrooms()
        }
    }
</script>