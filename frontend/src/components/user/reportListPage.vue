<template>
    <div class="container">
        <template v-if="requestStatus === 'success'">
            <page-header class="page-header">
                <breadcrumbs
                        :paths="breadcrumbData"
                        class="breadcrumbs"
                />

                <div class="row">
                    <div>Reports for computer #{{ computerId }} in classroom {{ classroomId }}</div>
                    <el-button size="mini">Prijavi kvar</el-button>
                </div>
            </page-header>

            <div class="content">
                <el-card
                        class="card-left"
                        :class="{active: currentSelectedReport === null}"
                        body-style="display: flex; flex-direction: column; flex-grow: 1; min-height: 0"
                >
                    <report-list v-model="currentSelectedReport" :reports="reports">
                        <template v-slot="{ report }">
                            <report-short-format
                                    :report="report"
                                    :key="report.reportId"
                            />
                        </template>
                    </report-list>
                </el-card>

                <el-card class="card-right">
                    <template v-if="currentSelectedReport === null">
                        Odaberite kvar
                    </template>
                    <div v-else class="column">
                        <template v-if="reportRequest.status === 'success'">
                            <i class="el-icon-arrow-left back-button" @click="currentSelectedReport=null"/>
                            <report-details :report="report"/>
                        </template>
                        <template v-else-if="reportRequest.status === 'loading'">
                            Loading...
                        </template>
                        <template v-else-if="reportRequest.status === 'error'">
                            {{ reportRequest.message }}
                        </template>
                    </div>
                </el-card>
            </div>
        </template>
        <template v-else-if="requestStatus === 'loading'">
            Loading...
        </template>
        <template v-else-if="requestStatus === 'error'">
            {{ requestErrorMessage }}
        </template>
    </div>
</template>

<style lang="sass" scoped>
    @import './src/assets/styles/breakPoints'

    .container
        height: 100%
        display: flex
        flex-direction: column
        .pager-header
            display: flex
            flex-direction: column
        .breadcrumbs
            margin-top: 5px
        .row
            display: flex
            flex-direction: row
            justify-content: space-between
        .content
            width: 100%
            display: flex
            flex-direction: row
            flex-grow: 1
            margin-top: 10px
            min-height: 0
            .card-left
                height: 100%
                width: 30%
                margin-right: 10px
                box-sizing: border-box
                display: flex
                @media ($mobileBreakPoint)
                    width: 0
                    &.active
                        width: 100%
            .card-right
                height: 100%
                flex-grow: 1
                box-sizing: border-box
                width: 0
                .column
                    display: flex
                    flex-direction: column
                    .back-button
                        display: none
                        @media ($mobileBreakPoint)
                            display: block



</style>

<script>
    import { Breadcrumbs } from '@/components/_common/breadcrumbs'
    import PageHeader from '@/components/_common/pageHeader'
    import ReportShortFormat from './reportShortFormat'
    import ReportList from '@/components/_common/reportList'

    import { mapState, mapActions, mapGetters } from 'vuex'
    import _ from "lodash";
    import ReportDetails from "@/components/user/reportDetails";

    export default {
        name: 'report-list-page',
        components: {
            ReportDetails,
            Breadcrumbs,
            PageHeader,
            ReportShortFormat,
            ReportList,
        },
        data() {
            return {
                currentSelectedReport: null,
            }
        },
        computed: {
            ...mapState('Classroom/Classroom', { classroomRequest: 'request' }),
            ...mapGetters('Classroom/Classroom', ['classroom']),
            ...mapState('Classroom/AllClassrooms', { allClassroomsRequest: 'request' }),
            ...mapGetters('Classroom/AllClassrooms', ['allClassrooms']),
            ...mapState('Report/ComputerReports', { computerReportsRequest: 'request' }),
            ...mapGetters('Report/ComputerReports', ['reports']),
            ...mapState('Report/Report', { reportRequest: 'request' }),
            ...mapGetters('Report/Report', ['report']),
            breadcrumbData() {
                return [
                    { name: 'pocetna', to: { name: 'homePage' } },
                    { name: 'ucionice', to: { name: 'classroomListPage' } },
                    {
                        children: _.map(this.allClassrooms, ({ name }) => {
                            return { name: name, to: { name: 'classroomPage', params: { classroomId: name } } }
                        }),
                        currentName: this.classroomId,
                    },
                    {
                       children: [
                           { name: 'opsti', to: { name: 'reportListPage', params: { computerId: 'general' } } },
                           ..._.map(this.classroom.computers, ({ computerId }) => {
                               return { name: computerId, to: { name: 'reportListPage', params: { computerId: computerId } } }
                           }),
                       ],
                        currentName: this.computerId === 'general' ? 'opsti' : this.computerId
                    }
                ]
            },
            classroomId() {
                return this.$route.params.classroomId
            },
            computerId() {
                return this.$route.params.computerId
            },
            requestStatus() {
                if (
                    this.classroomRequest.status === 'error' ||
                    this.allClassroomsRequest.status === 'error' ||
                    this.computerReportsRequest.status === 'error'
                ) {
                    return 'error'
                }
                if (
                    this.classroomRequest.status === 'loading' ||
                    this.allClassroomsRequest.status === 'loading' ||
                    this.computerReportsRequest.status === 'loading'

                ) {
                    return 'loading'
                }
                if (
                    this.classroomRequest.status === 'notInitialized' ||
                    this.allClassroomsRequest.status === 'notInitialized' ||
                    this.computerReportsRequest.status === 'notInitialized'
                ) {
                    return 'notInitialized'
                }

                return 'success'
            },
            requestErrorMessage() {
                if (this.classroomRequest.status === 'error')  return this.classroomRequest.message
                if (this.allClassroomsRequest.status === 'error') return this.allClassroomsRequest.message
                if (this.computerReportsRequest.status === 'error') return this.computerReportsRequest.message

                return null
            },
        },
        methods: {
            ...mapActions('Classroom/Classroom', ['fetchClassroom']),
            ...mapActions('Classroom/AllClassrooms', ['fetchAllClassrooms']),
            ...mapActions('Report/ComputerReports', ['fetchComputerReports']),
            ...mapActions('Report/Report', ['fetchReport']),
            getData() {
                if (['error', 'notInitialized'].includes(this.allClassroomsRequest.status)) {
                    this.fetchAllClassrooms()
                }

                if (['error', 'notInitialized'].includes(this.classroomRequest.status)) {
                    this.fetchClassroom({ classroomId: this.classroomId })
                }

                if (this.computerReportsRequest.status === 'loading') return

                this.fetchComputerReports({ classroomId: this.classroomId, computerId: this.computerId, })
            },
            getReportData(reportId) {
                if (_.isNil(this.debuncedMethod)) {
                    this.debuncedMethod = _.debounce((reportId) => {
                        this.fetchReport({ reportId: reportId })
                    }, 300)
                }
                this.debuncedMethod(reportId)
            }
        },
        watch: {
            $route: {
                immediate: true,
                handler(currentRoute, prevRoute) {
                    if (_.isNil(prevRoute)) {
                        this.getData()
                    } else if (
                        prevRoute.name === currentRoute.name && (
                            prevRoute.params.classroomId !== currentRoute.params.classroomId ||
                            prevRoute.params.computerId !== currentRoute.params.computerId
                        )
                    ) {
                        this.getData()
                    }

                    if (_.get(currentRoute, 'query.reportId', null) !== _.get(prevRoute, 'query.reportId', null)) {
                        this.getReportData(currentRoute.query.reportId)
                    }
                }
            },
            currentSelectedReport() {
                    this.$router.replace({ query: { reportId: this.currentSelectedReport.reportId } } )
            }
        }
    }
</script>