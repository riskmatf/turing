<template>
    <div class="column starch">
        <div class="row marginer-bottom">
            <report-type-sentence
                    :report-id="report.reportId"
                    :classroom-id="report.classroomName"
                    :computer-id="report.computerId"
                    :is-general="report.isGeneral"
            />
        </div>
        <div class="row marginer-bottom">
            <report-date class="date-full" :report-date="report.timestamp"/>
            <report-urgent-icon 
                :is-urgent="report.isUrgent"
                class="marginer-right"
            />
            <report-computer-location
                :computer-id="report.computerId"
                :schema-url="classroomSchemaUrl"
                :number-of-computers="numberOfComputers"
                class="marginer-right"
            />
        </div>
        <div class="marginer-bottom marginer-top">Opis kvara:</div>
        <report-description readonly :value="report.description" :max-rows="10"/>
        <div class="marginer-bottom marginer-top">
            <template v-if="report.hasAdminComment">
                <report-admin-display-name 
                    :admin-display-name="report.adminDisplayName"
                    class="marginer-bottom"
                />
                <report-admin-comment readonly :value="report.adminComment" :max-rows="10"/>
            </template>
            <template v-else>
                <div class="marginer-top">Nema komentara.</div>
            </template>
        </div>

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
    .marginer-bottom
        margin-bottom: 3px
    .marginer-top
        margin-top: 10px
    .marginer-right
        margin-right: 10px
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
