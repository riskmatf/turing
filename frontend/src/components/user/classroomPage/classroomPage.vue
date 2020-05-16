<template>
    <div class="classroom-container">
        <template v-if="requestStatus === 'success'">
            <page-header class="page-header">
                <div class="breadcrumbs">
                    <breadcrumbs :paths="breadcrumbData"/>
                </div>
                <div class="row">
                    <classroom-name class="name" :classroom-name="classroom.name"/>
                    <el-button
                        size="mini"
                        @click="generalClick"
                    >
                    <i class="el-icon-warning-outline" v-if="showGeneralIcon"></i>
                        Opšti kvarovi
                    </el-button>
                </div>
            </page-header>

            <div class="schema">
                <classroom-schema-card
                    :classroom-name="classroom.name"
                    :schema-url="classroom.schemaUrl"
                    :computers="classroom.computers"
                    @computerClick="computerClick"
                    @generalClick="generalClick"
                />
            </div>
            <div class="legend">
                <classroom-schema-legend/>
            </div>
        </template>
        <template v-else-if="requestStatus === 'loading'">
            <div class="loading">
                Učitavanje...
                <i class="el-icon-loading"></i>
            </div>
        </template>
        <template v-else-if="requestStatus === 'error'">
            <span class="text-danger">Greška: {{ requestErrorMessage }}</span>
        </template>
    </div>
</template>

<style lang="sass" scoped>
    @import "./src/assets/styles/breakPoints"

    .classroom-container
        display: flex
        flex-direction: column
        height: 100%
        font-size: 13pt
        @media ($mobileBreakPoint)
            font-size: 10pt
        .breadcrumbs
            margin-top: 5px
        .schema
            width: 90%
            align-self: center
            margin-bottom: 10px
            min-height: 0
            min-width: 0
            margin-top: 5px
            flex-grow: 1
            @media ($mobileBreakPoint)
                width: 100%
        .legend
            align-self: center
            margin-top: 5px
        .pager-header
            display: flex
            flex-direction: column
            .row
                display: flex
                flex-direction: row
                justify-content: space-between
                padding-right: 5px
                .name
                    align-self: center
                    padding-left: 10px
    .loading
        margin: 20px

</style>

<script>
    import Breadcrumbs from '@/components/_common/breadcrumbs/breadcrumbs'
    import ClassroomSchemaCard from './classroomSchemaCard'
    import ClassroomSchemaLegend from './classroomSchemaLegend'
    import PageHeader from '@/components/_common/pageHeader'
    import { ClassroomName } from '@/components/_common/classroom'
    import { mapState, mapActions, mapGetters } from 'vuex'
    import _ from 'lodash'

    export default {
        name: 'classroom-page',
        components: {
            Breadcrumbs,
            ClassroomSchemaCard,
            ClassroomSchemaLegend,
            PageHeader,
            ClassroomName,
        },
        computed: {
            ...mapState('User/Classroom/Classroom', {classroomRequest: 'request'}),
            ...mapGetters('User/Classroom/Classroom', ['classroom']),
            ...mapState('User/Classroom/AllClassrooms', {allClassroomsRequest: 'request'}),
            ...mapGetters('User/Classroom/AllClassrooms', ['allClassrooms']),
            breadcrumbData() {
                return [
                    { name: 'početna', to: { name: 'homePage' } },
                    { name: 'učionice', to: { name: 'classroomListPage' } },
                    {
                        children: _.map(this.allClassrooms, ({ name }) => {
                            return { name: name, to: { name: 'classroomPage', params: { classroomId: name } } }
                        }),
                        currentName: this.classroomId,
                    },
                ]
            },
            classroomId() {
                return this.$route.params.classroomId
            },
            requestStatus() {
                if (this.classroomRequest.status === 'error' || this.allClassroomsRequest.status === 'error') {
                    return 'error'
                }
                if (this.classroomRequest.status === 'loading' || this.allClassroomsRequest.status === 'loading') {
                    return 'loading'
                }
                if (this.classroomRequest.status === 'notInitialized' || this.allClassroomsRequest.status === 'notInitialized') {
                    return 'notInitialized'
                }

                return 'success'
            },
            requestErrorMessage() {
                if (this.classroomRequest.status === 'error')  return this.classroomRequest.message
                if (this.allClassroomsRequest.status === 'error') return this.allClassroomsRequest.message

                return null
            },
            showGeneralIcon() {
                return this.classroom.hasGeneralReports
            },
        },
        methods: {
            ...mapActions('User/Classroom/Classroom', ['fetchClassroom']),
            ...mapActions('User/Classroom/AllClassrooms', ["fetchAllClassrooms"]),
            computerClick(computerId) {
                const computer = this.classroom.computers.find(({ computerId:cId }) => cId === computerId)
                if (computer !== undefined && computer.isBroken) {
                    this.$message({
                        message: `Racunar ${computerId} nije u funkciji`,
                        type: 'error',
                        duration: '1500',
                    })
                    return
                }

                this.$router.push({ name: 'reportListPage', params: { computerId: computerId } })
            },
            generalClick() {
                this.$router.push({ name: 'reportListPage', params: { computerId: 'general'} })
            },
            getData() {
                if (['error', 'notInitialized'].includes(this.allClassroomsRequest.status)) {
                    this.fetchAllClassrooms()
                }

                if (this.classroomRequest.status === 'loading') return

                this.fetchClassroom({ classroomId: this.classroomId })
            }
        },
        watch: {
            $route: {
                immediate: true,
                handler(currentRoute, prevRoute) {
                    if (_.isNil(prevRoute))  {
                        this.getData()
                        return
                    }

                    if (
                        prevRoute.name === currentRoute.name &&
                        prevRoute.params.classroomId !== currentRoute.params.classroomId
                    ) {
                        this.getData()
                    }
                }
            }
        }
    }
</script>