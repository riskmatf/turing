<template>
    <div class="column">
        <report-id :report-id="report.reportId"/>
        <report-date :report-date="report.timestamp"/>
        <report-description :max-rows="10" :value="report.description" readonly/>
    </div>
</template>

<style lang="sass" scoped>
    .column
        display: flex
        flex-direction: column

</style>

<script>
    import {
        ReportId,
        ReportDate,
        ReportDescription
    } from '@/components/_common/report'

    export default {
        components: {
            ReportId,
            ReportDate,
            ReportDescription,
        },
        props: {
            report: Object,
        }
    }
</script>
