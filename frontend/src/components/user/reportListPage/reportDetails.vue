<template>
    <div class="column starch">
        <div class="row">
            <report-type-sentence
                    :report-id="report.reportId"
                    :classroom-id="report.classroomName"
                    :computer-id="report.computerId"
                    :is-general="report.isGeneral"
            />
        </div>
        <div class="row">
            <report-date class="date-full" :report-date="report.timestamp"/>
            <report-urgent-icon :is-urgent="report.isUrgent"/>
            <report-computer-location
                :computer-id="report.computerId"
                :schema-url="classroomSchemaUrl"
                :number-of-computers="numberOfComputers"
            />
        </div>
        <report-description readonly :value="report.description" :max-rows="10"/>
        <template v-if="report.hasAdminComment">
            <report-admin-display-name :admin-display-name="report.adminDisplayName"/>
            <report-admin-comment readonly :value="report.adminComment" :max-rows="10"/>
        </template>
    </div>
</template>

<style lang="sass" scoped>
    .column
        display: flex
        flex-direction: column
        &.starch
            flex-grow: 1
            min-height: 0
            overflow-y: auto
    .row
        display: flex
        flex-direction: row
        .date-full
            flex-grow: 1

</style>

<script>
    import {
        ReportTypeSentence,
        ReportUrgentIcon,
        ReportDate,
        ReportDescription,
        ReportAdminDisplayName,
        ReportAdminComment,
        ReportComputerLocation,
    } from '@/components/_common/report'

    export default {
        components: {
            ReportTypeSentence,
            ReportUrgentIcon,
            ReportDate,
            ReportDescription,
            ReportAdminDisplayName,
            ReportAdminComment,
            ReportComputerLocation,
        },
        props: {
            report: Object,
            classroomSchemaUrl: String,
            numberOfComputers: Number,
        }
    }
</script>
