<template>
    <div class="content-grid">
        <div class="report-controls">
            <report-solve-button :disabled="readonly" @click="confirmSolveReport"/>
            <report-delete-button :disabled="readonly" @click="confirmDeleteReport"/>
        </div>
        <report-type-sentence
            :classroom-id="report.classroomName"
            :computer-id="report.computerId"
            :report-id="report.reportId"
            :is-general="report.isGeneral"
        />
        <div class="report-indicators-row">
            <report-date :report-date="report.timestamp"/>
            <report-solved-indicator :solved="report.fixed"/>
            <report-urgent-icon :is-urgent="report.isUrgent"/>
            <report-computer-location
                :computer-id="report.computerId"
                :number-of-computers="classroomComputerCount"
                :schema-url="classroomSchemaUrl"
            />
        </div>
        <div>Opis kvara:</div>
        <report-description readonly :value="report.description" :max-rows="10"/>
        <div class="report-comment-actions">
            <template v-if="report.hasAdminComment">
                <report-admin-display-name :admin-display-name="report.adminDisplayName"/>
                <div v-if="canEditComment && !isEditModeEnabled" class="far fa-edit" @click="editComment"></div>
                <template v-else-if="canEditComment && isEditModeEnabled">
                    <span class="fas fa-check button-icon text-success" @click="updateComment"></span>
                    <span class="fas fa-times button-icon text-danger" @click="cancelCommentEdit"></span>
                </template>
            </template>
            <template v-else>
                <div>Nema komentara.</div>
                <span class="fas fa-plus button-icon text-success" @click="addComment"></span>
            </template>
        </div>
        <report-admin-comment
            v-if="report.hasAdminComment"
            :readonly="!canEditComment || !isEditModeEnabled"
            v-model="report.adminComment"
            :max-rows="10"
        />
    </div>
</template>

<style lang="sass" scoped>
    .content-grid
        height: 100%
        display: grid
        grid-template-rows: repeat(8, max-content)
        grid-row-gap: 10px
        overflow-y: auto
        .report-indicators-row
            display: grid
            grid-template-columns: 1fr repeat(3, max-content)
            grid-column-gap: 10px
        .report-comment-actions
            display: grid
            grid-template-columns: 1fr repeat(2, max-content)
            grid-column-gap: 10px
        .report-controls
            display: grid
            grid-template-columns: max-content max-content
            grid-column-gap: 10px
            justify-content: right
            align-items: center

</style>

<script>
    import {
        ReportTypeSentence,
        ReportDate,
        ReportUrgentIcon,
        ReportComputerLocation,
        ReportDescription,
        ReportAdminComment,
        ReportAdminDisplayName,
        ReportSolvedIndicator,
        ReportSolveButton,
        ReportDeleteButton,
    } from '@/components/_common/report'
    import { mapGetters } from 'vuex'

    export default {
        components: {
            ReportTypeSentence,
            ReportDate,
            ReportUrgentIcon,
            ReportComputerLocation,
            ReportDescription,
            ReportAdminComment,
            ReportAdminDisplayName,
            ReportSolvedIndicator,
            ReportSolveButton,
            ReportDeleteButton,
        },
        props: {
            report: Object,
            classroomComputerCount: Number,
            classroomSchemaUrl: String,
            readonly: Boolean,
        },
        data() {
            return {
                isEditModeEnabled: false,
                previousComment: null,
            }
        },
        computed: {
            ...mapGetters('Admin/Admin', ['adminDisplayName']),
            canEditComment() {
                return this.report.canChangeComment && !this.readonly
            }
        },
        methods: {
            editComment() {
                this.isEditModeEnabled = true
                this.previousComment = this.report.adminComment
            },
            cancelCommentEdit() {
                this.isEditModeEnabled = false
                this.report.adminComment = this.previousComment
                this.previousComment = null

                if (this.report.adminComment === null) {
                    this.report.hasAdminComment = false
                    this.report.adminDisplayName = null
                    this.report.canChangeComment = false
                }
            },
            updateComment() {
                if (this.report.adminComment.trim() === '') {
                    this.cancelCommentEdit()
                    this.$message.error('Prazan komentar nije dozvoljen')
                    return
                }
                this.$emit('updateComment')
                this.previousComment = null
                this.isEditModeEnabled = false
            },
            addComment() {
                this.report.hasAdminComment = true
                this.report.adminDisplayName = this.adminDisplayName
                this.report.adminComment = ""
                this.isEditModeEnabled = true
                this.report.canChangeComment = true
            },
            confirmSolveReport() {
                this.$confirm('Da li zelite da resite kvar', {
                    confirmButtonText: 'Da',
                    cancelButtonText: 'Ne',
                    customClass: 'message-box-reversed',
                }).then(() => {
                    this.$emit('solveReport')
                })
            },
            confirmDeleteReport() {
                this.$confirm('Da li zelite da obrisete kvar', {
                    confirmButtonText: 'Da',
                    cancelButtonText: 'Ne',
                    customClass: 'message-box-reversed',
                }).then(() => {
                    this.$emit('deleteReport')
                })

            }
        },
    }
</script>