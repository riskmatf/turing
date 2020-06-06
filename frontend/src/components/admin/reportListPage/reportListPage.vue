<template>
    <div v-if="classroomDataRequestStatus === 'success'" class="content">
        <page-header class="pager-header">
            <breadcrumbs :paths="breadcrumbData"/>
            <filters
                v-model="filters"
                filter-comments
                filter-fixed
                filter-urgent
                @updateFilters="updateFilters"
            />
            <div class="row">
                <div class="name">{{ pageTitle }}</div>
                <el-button size="mini" @click="isReportModalVisible=true">
                    Prijavi kvar
                </el-button>
                <add-report-modal
                    :visible.sync="isReportModalVisible"
                    :computer-id="computerId"
                    :classroom-id="classroomId"
                    :is-general="areGeneralReports"
                    @change="reportAdded"
                />
            </div>
        </page-header>
        <left-right-layout>
            <template v-slot:left>
                <template v-if="maxPage === null">
                    Ucitavanje... <span class="el-icon-loading"/>
                </template>
                <template v-else>
                    <pager v-model="page" :max-page="maxPage" @change="encodeUrlParams">
                        <template v-if="reportsListRequest.status === 'loading'">
                            Ucitavanje... <span class="el-icon-loading"/>
                        </template>
                        <template v-else-if="reportsListRequest.status === 'success'">
                            <report-list
                                    :value="currentSelectedReport"
                                    :reports="reports"
                                    @input="selectReport"
                            >
                                <template v-slot="{ report }">
                                    <report-short-format
                                            :report="report"
                                            :key="report.reportId"
                                    />
                                </template>
                            </report-list>
                        </template>
                    </pager>
                </template>
            </template>

            <template v-slot:right>
                <template v-if="currentSelectedReport === null">
                    Odaberite kvar
                </template>
                <template v-else>
                    <div @click="deselectReport">
                        <span class="el-icon-arrow-left back-button"/>
                    </div>
                    <template v-if="reportRequest.status === 'success'">
                        <report-details
                            :report="report"
                            :classroom-schema-url="currentReportClassroomSchemaDetails.schemaUrl"
                            :classroom-computer-count="currentReportClassroomSchemaDetails.numberOfComputers"
                            :readonly="requestInProgress"
                            @updateComment="updateCommentForReport"
                            @solveReport="handleSolveReport"
                            @deleteReport="handleDeleteReport"
                        />
                    </template>
                    <template v-else-if="reportRequest.status === 'loading'">
                        Ucitavanje... <span class="el-icon-loading"/>
                    </template>
                    <template v-else-if="reportRequest.status === 'error'">
                        Greska: {{ reportRequest.message }}
                    </template>
                </template>
            </template>
        </left-right-layout>

    </div>
    <div v-else-if="classroomDataRequestStatus === 'loading'">
        Ucitavanje...
    </div>
    <div v-else-if="classroomDataRequestStatus === 'error'">
        Greska!
    </div>
</template>

<style lang="sass" scoped>
    @import 'src/assets/styles/breakPoints'

    .content
        height: 100%
        display: grid
        grid-template-rows: auto 1fr
        grid-row-gap: 20px
    .breadcrumbs
        margin-bottom: 10px
    .back-button
        display: none
        @media ($mobileBreakPoint)
            display: block
            margin-bottom: 10px
    .row
            display: flex
            flex-direction: row
            justify-content: space-between
            .name
                align-self: center
                padding-left: 10px
    .pager-header
            display: flex
            flex-direction: column
</style>

<script>
    import PageHeader from '@/components/_common/pageHeader'
    import { Breadcrumbs } from '@/components/_common/breadcrumbs'
    import { Filters } from '@/components/_common/filters'
    import LeftRightLayout from '@/components/_common/leftRightLayout'
    import Pager from '@/components/_common/pager'
    import ReportList from '@/components/_common/reportList'
    import ReportShortFormat from '@/components/admin/reportShortFormat'
    import ReportDetails from '@/components/admin/reportDetails'
    import AddReportModal from './addReportModal'
    import { encodeUrlParams, decodeUrlParams } from '@/store/modules/admin/reports/reportList'
    import { mapState, mapGetters, mapActions } from 'vuex'
    import _ from 'lodash'
   
    export default {
        components: {
            PageHeader,
            Breadcrumbs,
            Filters,
            LeftRightLayout,
            Pager,
            ReportList,
            ReportShortFormat,
            ReportDetails,
            AddReportModal,
        },
        data() {
            return {
                filters: {},
                page: 1,
                currentSelectedReportId: null,
                maxPageCash: null,
                requestInProgress: false,
                isReportModalVisible: false,
            }
        },
        computed: {
            ...mapState('Admin/Classroom/Classroom', { classroomRequest: 'request' }),
            ...mapGetters('Admin/Classroom/Classroom', ['classroom']),
            ...mapState('Admin/Classroom/AllClassrooms', { allClassroomsRequest: 'request' }),
            ...mapGetters('Admin/Classroom/AllClassrooms', ['allClassrooms']),
            ...mapState('Admin/Report/ReportList', { reportsListRequest: 'request' }),
            ...mapGetters('Admin/Report/ReportList', {
                maxPageFromServer: 'maxPage',
                reports: 'reports'
            }),  
            ...mapState('Admin/Report/Report', { reportRequest: 'request' }),
            ...mapGetters('Admin/Report/Report', ['report']), 
            breadcrumbData() {
                return [
                    { name: 'početna', to: { name: 'adminHomePage' } },
                    { name: 'učionice', to: { name: 'reportsFilterPage' } },
                    {
                        children: _.map(this.allClassrooms, ({ name }) => {
                            return { name: name, to: { name: 'adminClassroomPage', params: { classroomId: name } } }
                        }),
                        currentName: this.classroomId,
                    },
                    {
                       children: [
                           { name: 'opšti', to: { name: 'adminReportListPage', params: { computerId: 'general' } } },
                           ..._.map(this.classroom.computers, ({ computerId }) => {
                               return { name: (computerId === 0 ? 'N' : computerId), to: { name: 'adminReportListPage', params: { computerId: computerId } } }
                           }),
                       ],
                       currentName: this.areGeneralReports ? 'opšti' : (this.computerId === 0 ? 'N' : this.computerId)
                    }
                ]
            },
            classroomId() {
                return this.$route.params.classroomId
            },
            computerId() {
                if (this.areGeneralReports) return null

                return parseInt(this.$route.params.computerId, 10)
            },
            areGeneralReports() {
                return this.$route.params.computerId === 'general'
            }, 
            classroomDataRequestStatus() {
                if (
                    this.classroomRequest.status === 'error' ||
                    this.allClassroomsRequest.status === 'error'
                ) {
                    return 'error'
                }
                if (
                    this.classroomRequest.status === 'loading' ||
                    this.allClassroomsRequest.status === 'loading'

                ) {
                    return 'loading'
                }
                if (
                    this.classroomRequest.status === 'notInitialized' ||
                    this.allClassroomsRequest.status === 'notInitialized'
                ) {
                    return 'notInitialized'
                }

                return 'success'
            },
            pageTitle() {
                let result = `Kvarovi u učionici ${this.classroomId},`
                if (this.areGeneralReports) {
                    result = `Opšti kvarovi u učionici ${this.classroomId}`
                }
                if (!this.areGeneralReports) { 
                    result += ' na računaru' 
                    result += ( this.computerId === 0 ? 
                        ' N' : ` #${this.computerId}` ) 
                } 

                return result
            },
            maxPage() {
                return this.maxPageFromServer === null ? this.maxPageCash : this.maxPageFromServer
            },
            currentSelectedReport() {
                if (!this.reports) return null
                return this.reports.find((report) => {
                    return report.reportId === this.currentSelectedReportId
                }) || null
            },
            currentReportClassroomSchemaDetails() {
                const classroom = this.allClassrooms.find((classroom) => {
                    return classroom.name === this.report.classroomName
                })
                return {
                    schemaUrl: classroom.schemaUrl,
                    numberOfComputers: classroom.numberOfComputers.working + classroom.numberOfComputers.broken,
                }
            },
        },
        methods: {
            ...mapActions('Admin/Classroom/Classroom', ['fetchClassroom']),
            ...mapActions('Admin/Classroom/AllClassrooms', ['fetchAllClassrooms']),
            ...mapActions('Admin/Report/ReportList', ['fetchReports']),
            ...mapActions('Admin/Report/Report', ['fetchReport', 'updateComment', 'solveReport', 'deleteReport']),
            encodeUrlParams() {
                const query = encodeUrlParams(this.filters)
                query.page = this.page
                if (this.currentSelectedReportId !== null) {
                    query.reportId = this.currentSelectedReportId
                } else {
                    query.reportId = undefined
                }
                this.$router.push({ query: query })
            },
            decodeUrlParams() {
                this.filters = decodeUrlParams(this.$route.query)
                this.page = parseInt(this.$route.query.page, 10) || 1
                this.currentSelectedReportId = parseInt(this.$route.query.reportId, 10) || null
            },
            updateFilters() {
                this.page = 1
                this.currentSelectedReportId = null
                this.encodeUrlParams()
            },
            selectReport(report) {
                this.currentSelectedReportId = report.reportId
                this.encodeUrlParams()
            },
            deselectReport() {
                this.currentSelectedReportId = null
                this.encodeUrlParams()
            },
            getReports() {
                this.fetchReports({
                    filters: { 
                        ...this.filters, 
                        classrooms: [ this.classroomId ], 
                        computes: [this.computerId] 
                    },
                    page: this.page,
                }).then(({ paging: { maxNumOfPages } }) => {
                    this.maxPageCash = maxNumOfPages || 1
                })
            },
            updateCommentForReport() {
                this.requestInProgress = true
                this.updateComment({
                    reportId: this.report.reportId,
                    comment: this.report.adminComment,
                }).then(() => {
                    this.$message.success('Uspesno promenjen komentar')
                }).catch((e) => {
                    this.$message.error(`Nije uspelo promena komentara ${e}`)
                }).finally(() => {
                    this.fetchReport({ reportId: this.report.reportId }).finally(() => {
                        this.requestInProgress = false
                    })
                })
            },
            handleSolveReport() {
                this.requestInProgress = true
                this.solveReport({ reportId: this.report.reportId }).then(() => {
                    this.$message.success('Solved')
                }).catch((e) => {
                    this.$message.error(`Failed ${e}`)
                }).finally(() => {
                    this.fetchReport({ reportId: this.report.reportId }).finally(() => {
                        this.requestInProgress = false
                    })
                })
            },
            handleDeleteReport() {
                this.requestInProgress = true
                this.deleteReport({ reportId: this.report.reportId }).then(() => {
                    this.$message.success('Deleted')
                    this.currentSelectedReportId = null
                    this.encodeUrlParams()
                    this.getReports()
                }).catch((e) => {
                    this.$message.error(`Failed ${e}`)
                }).finally(() => {
                    this.requestInProgress = false
                })
            },
            reportAdded() {
                this.isReportModalVisible = false
                this.getReports()
            },
        },
        created() {
            this.fetchAllClassrooms(),
            this.fetchClassroom({ classroomId: this.classroomId })
        },
        watch: {
            '$route': {
                immediate: true,
                handler(currentPage, previousPage) {
                    this.decodeUrlParams()

                    const computerHasChanged = 
                        _.get(currentPage, 'params.computerId', null) !== _.get(previousPage, 'params.computerId', null)
                    const currentQuery = _.get(currentPage, 'query', {})
                    const previousQuery = _.get(previousPage, 'query', {})
                    const currentReportId = currentQuery.reportId
                    const previousReportId = previousQuery.reportId
                    delete currentQuery.reportId
                    delete previousQuery.reportId
                    if (_.isNil(previousPage) || !_.isEqual(currentQuery, previousQuery) || computerHasChanged) {
                        this.getReports()
                    }

                    if (currentReportId !== previousReportId) {
                        this.fetchReport({ reportId: currentReportId })
                    }
                },
            },
        },
    }
</script>