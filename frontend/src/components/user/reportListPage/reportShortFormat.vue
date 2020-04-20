<template>
    <div class="column">
        <div class="row">
            <report-id class="report-id" :report-id="report.reportId"/>
            <report-urgent-icon style="padding-right: 10px" :is-urgent="report.urgent"/>
            <report-message-icon :has-message="report.hasAdminComment"/>

        </div>
        <report-date class="report-date" :report-date="report.timestamp"/>
    </div>
</template>

<style lang="sass" scoped>
    .column
        display: flex
        flex-direction: column
        .report-date
            align-self: flex-end
        .row
            display: flex
            flex-direction: row
            .report-id
                flex-grow: 1
                font-size: 16pt



</style>

<script>
    import { ReportId, ReportDate, ReportMessageIcon, ReportUrgentIcon } from '@/components/_common/report'

    export default {
        components: {
            ReportId,
            ReportDate,
            ReportMessageIcon,
            ReportUrgentIcon
        },
        props: {
            report: Object,
        },
    }
</script>