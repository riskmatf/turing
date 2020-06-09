<template>
    <div v-if="request.status === 'success'" class="content">
        <page-header>
            <breadcrumbs :paths="breadcrumbData" class="breadcrumbs"/>
            <filters
                v-model="filters"
                filter-classrooms
                filter-locations
                filter-comments
                filter-fixed
                filter-urgent
                :classrooms-filter-options="classroomsFilterOptions"
                :locations-filter-options="locationsFilterOptions"
                @updateFilters="updateFilters"
            />
        </page-header>
        <left-right-layout :left-card-active="currentSelectedReport === null">
            <template v-slot:left>
                <template v-if="maxPage === null">
                    Ucitavanje... <span class="el-icon-loading"/>
                </template>
                <template v-else>
                    <pager v-model="page" :max-page="maxPage" @change="handlePageChange">
                        <template v-if="reportsListRequest.status === 'loading'">
                            Učitavanje... <span class="el-icon-loading"/>
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
                        Učitavanje... <span class="el-icon-loading"/>
                    </template>
                    <template v-else-if="reportRequest.status === 'error'">
                        Greška: {{ reportRequest.message }}
                    </template>
                </template>
            </template>
        </left-right-layout>
    </div>
    <div v-else-if="request.status === 'loading'">Učitavanje...<span class="el-icon-loading"/></div>
    <div v-else-if="request.status === 'error'">{{ request.message }}</div>
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
</style>

<script>
    import { Filters } from '@/components/_common/filters'
    import PageHeader from '@/components/_common/pageHeader'
    import { Breadcrumbs } from '@/components/_common/breadcrumbs'
    import LeftRightLayout from '@/components/_common/leftRightLayout'
    import Pager from '@/components/_common/pager'
    import ReportList from '@/components/_common/reportList'
    import ReportShortFormat from './reportShortFormat'
    import ReportDetails from './reportDetails'
    import { mapActions, mapGetters, mapState } from "vuex"
    import { encodeUrlParams, decodeUrlParams } from '@/store/modules/admin/reports/reportList'
    import _ from "lodash"

    export default {
        components: {
            Breadcrumbs,
            Filters,
            PageHeader,
            LeftRightLayout,
            Pager,
            ReportList,
            ReportShortFormat,
            ReportDetails,
        },
        data() {
            return {
                filters: {},
                page: 1,
                maxPageCash: null,
                currentSelectedReportId: null,
                requestInProgress: false,
            }
        },
        computed: {
            ...mapState('Admin/Classroom/AllClassrooms', ['request']),
            ...mapState('Admin/Report/ReportList', { reportsListRequest: 'request' }),
            ...mapGetters('Admin/Classroom/AllClassrooms', ['classroomsGroupedByLocation', 'allClassrooms']),
            ...mapGetters('Admin/Report/ReportList', {
                maxPageFromServer: 'maxPage',
                reports: 'reports'
            }),
            ...mapState('Admin/Report/Report', { reportRequest: 'request' }),
            ...mapGetters('Admin/Report/Report', ['report']),
            classroomsFilterOptions() {
                return _.map(this.allClassrooms, (classroom) => {
                    return classroom.name
                })
            },
            locationsFilterOptions() {
                return _.keys(this.classroomsGroupedByLocation)
            },
            breadcrumbData() {
                return [
                    {name: 'početna', to: { name: 'adminHomePage' } },
                    { name: 'kvarovi', to: { name: 'reportsFilterPage' } }
                ]
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
            updateCommentForReport() {
                this.requestInProgress = true
                this.updateComment({
                    reportId: this.report.reportId,
                    comment: this.report.adminComment,
                }).then(() => {
                    this.$message.success('Uspešno promenjen komentar')
                    this.markHasCommentInList(this.report.reportId)
                }).catch((e) => {
                    this.$message.error(`Nije uspela promena komentara ${e}`)
                }).finally(() => {
                    this.fetchReport({ reportId: this.report.reportId }).finally(() => {
                        this.requestInProgress = false
                    })
                })
            },
            handleSolveReport() {
                this.requestInProgress = true
                this.solveReport({ reportId: this.report.reportId }).then(() => {
                    this.$message.success('Računar je popravljen.')
                    this.markSolvedInList(this.report.reportId)

                }).catch((e) => {
                    this.$message.error(`Nije uspelo popravljanje: ${e}`)
                }).finally(() => {
                    this.fetchReport({ reportId: this.report.reportId }).finally(() => {
                        this.requestInProgress = false
                    })
                })
            },
            handleDeleteReport() {
                this.requestInProgress = true
                this.deleteReport({ reportId: this.report.reportId }).then(() => {
                    this.$message.success('Kvar je uspešno obrisan.')
                    this.currentSelectedReportId = null
                    this.encodeUrlParams()
                    this.getReports()
                }).catch((e) => {
                    this.$message.error(`Nije uspelo brisanje komentara: ${e}`)
                }).finally(() => {
                    this.requestInProgress = false
                })
            },
            handlePageChange() {
                this.currentSelectedReportId = null
                this.encodeUrlParams()
            },
            getReports() {
                this.fetchReports({
                    filters: this.filters,
                    page: this.page,
                }).then(({ paging: { maxNumOfPages } }) => {
                    this.maxPageCash = maxNumOfPages || 1
                })
            },
            markSolvedInList(reportId) {
                const solvedReport = this.reports.find((report)=> {
                    return report.reportId === reportId
                })
                if (!_.isNil(solvedReport)) {
                    solvedReport.fixed = true
                }
            },
            markHasCommentInList(reportId) {
                const commentedReport = this.reports.find((report)=> {
                    return report.reportId === reportId
                })
                if (!_.isNil(commentedReport)) {
                    commentedReport.hasAdminComment = true
                }
            },
        },
        watch: {
            '$route': {
                immediate: true,
                handler(currentPage, previousPage) {
                    this.decodeUrlParams()

                    const currentQuery = _.get(currentPage, 'query', {})
                    const previousQuery = _.get(previousPage, 'query', {})
                    const currentReportId = currentQuery.reportId
                    const previousReportId = previousQuery.reportId
                    delete currentQuery.reportId
                    delete previousQuery.reportId
                    if (_.isNil(previousPage) || !_.isEqual(currentQuery, previousQuery)) {
                        this.getReports()
                    }

                    if (currentReportId !== previousReportId) {
                        this.fetchReport({ reportId: currentReportId })
                    }
                },
            },
        },
        created() {
            this.fetchAllClassrooms()
        },
    }
</script>

