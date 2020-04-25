<template>
    <div class="container">
        <template v-if="requestStatus === 'success'">
            <page-header class="page-header">
                <breadcrumbs
                        :paths="breadcrumbData"
                        class="breadcrumbs"
                />
                <div class="row">
                    <div class="name">Reports for computer #{{ computerId }} in classroom {{ classroomId }}</div>
                    <el-button size="mini" @click="isReportModalVisible=true">
                        Prijavi kvar
                    </el-button>
                    <add-report-modal
                        :visible.sync="isReportModalVisible"
                        :computer-id="computerId"
                        :classroom-id="classroomId"
                        @change="commentAdded"
                    />
                </div>
            </page-header>

            <div class="content">
                <el-card
                        class="card-left"
                        :class="{active: !isReportSelected}"
                        body-style="display: flex; flex-direction: column; flex-grow: 1; min-height: 0"
                >
                    <report-list
                        :value="currentSelectedReport"
                        :reports="reports"
                        @input="(reportt) => {selectReport(reportt)}"
                    >
                        <template v-slot="{ report }">
                            <report-short-format
                                    :report="report"
                                    :key="report.reportId"
                            />
                        </template>
                    </report-list>
                </el-card>

                <el-card
                    class="card-right"
                    body-style="display: flex; flex-direction: column; flex-grow: 1; min-height: 0"
                >
                    <template v-if="!isReportSelected">
                        Odaberite kvar
                    </template>
                    <div v-else class="column full">
                        <template v-if="reportRequest.status === 'success'">
                            <i class="el-icon-arrow-left back-button" @click="selectReport(null)"/>
                            <report-details
                                :report="report"
                                :classroom-schema-url="classroom.schemaUrl"
                                :number-of-computers="classroom.computers.length"
                            />
                        </template>
                        <template v-else-if="reportRequest.status === 'loading'">
                            <div class="loader">
                                Loading...
                                <i class="el-icon-loading"></i>
                            </div>
                        </template>
                        <template v-else-if="reportRequest.status === 'error'">
                            {{ reportRequest.message }}
                        </template>
                    </div>
                </el-card>
            </div>
        </template>
        <template v-else-if="requestStatus === 'loading'">
            <div class="loader">
                Loading...
                <i class="el-icon-loading"></i>
            </div>
        </template>
        <template v-else-if="requestStatus === 'error'">
            {{ requestErrorMessage }}
        </template>
    </div>
</template>

<style lang="sass" scoped>
    @import '../../../assets/styles/breakPoints'

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
            .name
                align-self: center
                padding-left: 10px
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
                    margin-right: 0px
                    &.active
                        width: 100%
            .card-right
                height: 100%
                flex-grow: 1
                display: flex
                box-sizing: border-box
                width: 0
                .column
                    display: flex
                    flex-direction: column
                    &.full
                        height: 100%
                    .back-button
                        display: none
                        @media ($mobileBreakPoint)
                            display: block
    .loader
        padding: 20px


</style>

<script>
    import _ from "lodash";
    import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
    import { Breadcrumbs } from '@/components/_common/breadcrumbs'
    import PageHeader from '@/components/_common/pageHeader'
    import ReportShortFormat from './reportShortFormat'
    import ReportList from '@/components/_common/reportList'
    import ReportDetails from "@/components/user/reportListPage/reportDetails";
    import AddReportModal from './addReportModal'

    export default {
        name: 'report-list-page',
        components: {
            ReportDetails,
            Breadcrumbs,
            PageHeader,
            ReportShortFormat,
            ReportList,
            AddReportModal,
        },
        data() {
            return {
                isReportModalVisible: false,
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
            isReportSelected() {
                return !_.isNil(this.selectedReportId)
            },
            selectedReportId() {
                let reportId = _.get(this.$route.query, 'reportId', null)
                if (!_.isNil(reportId)) {
                    reportId = parseInt(reportId, 10)
                }

                return isNaN(reportId) ? null : reportId
            },
            currentSelectedReport() {
                const report = _.find(this.reports, (report) => report.reportId === this.selectedReportId)
                return report || null
            }
        },
        methods: {
            ...mapActions('Classroom/Classroom', ['fetchClassroom']),
            ...mapActions('Classroom/AllClassrooms', ['fetchAllClassrooms']),
            ...mapActions('Report/ComputerReports', ['fetchComputerReports']),
            ...mapActions('Report/Report', ['fetchReport']),
            ...mapMutations('Report/Report', ['clearReportData']),
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
                if (this.isReportSelected) {
                    if (_.isNil(this.debuncedMethod)) {
                        this.debuncedMethod = _.debounce((reportId) => {
                            this.fetchReport({ reportId: reportId })
                        }, 300)
                    }
                    this.debuncedMethod(reportId)
                }
            },
            selectReport(report) {
                if (_.isNil(report)) {
                    this.$router.replace({})
                } else if (report.reportId !== this.selectedReportId){
                    this.$router.replace({ query: { reportId: report.reportId } })
                }
            },
            commentAdded() {
                this.isReportModalVisible = false
                this.getData()
            },
        },
        watch: {
            $route: {
                immediate: true,
                handler(currentRoute, prevRoute) {
                    const hasPreviousRoute = !_.isNil(prevRoute)
                    const areRoutesSame = hasPreviousRoute && prevRoute.name === currentRoute.name
                    const classroomHasChanged = hasPreviousRoute && prevRoute.params.classroomId !== currentRoute.params.classroomId
                    const computerHasChanged = hasPreviousRoute && prevRoute.params.computerId !== currentRoute.params.computerId
                    const classroomOrComputerHasChanged =  classroomHasChanged || computerHasChanged

                    if (!hasPreviousRoute || (areRoutesSame && classroomOrComputerHasChanged)) {
                        this.getData()
                    }

                    if (!_.get(currentRoute, 'query.reportId', null)) {
                        this.clearReportData()
                    } else if (_.get(currentRoute, 'query.reportId', null) !== _.get(prevRoute, 'query.reportId', null)) {
                        this.getReportData(currentRoute.query.reportId)
                    }
                }
            },
        }
    }
</script>