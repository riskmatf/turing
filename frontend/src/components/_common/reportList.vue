<template>
    <div class="list">
        <div
            v-for="report in reports"
            :key="report.reportId"
            class="item"
            :class="{ active: report.reportId === currentSelectedReportId}"
            @click="reportSelected(report)"
        >
            <slot :report="report"></slot>
        </div>
    </div>
</template>

<style lang="sass" scoped>
    .list
        display: flex
        flex-direction: column
        min-height: 0
        max-height: 100%
        overflow-y: auto
        & > .item
            &:hover
                background-color: #f3f3f3
                cursor: pointer
            &:not(:last-child)
                margin-bottom: 5px
            &.active
                color: #3a8ee6
</style>

<script>
    import _ from 'lodash'

    export default {
        props: {
            reports: Array,
            value: Object,
        },
        computed: {
            model: {
                get() {
                    return this.value
                },
                set(val) {
                    this.$emit('input', val)
                }
            },
            currentSelectedReportId() {
                return _.get(this.model, 'reportId', null)
            },
        },
        methods: {
            reportSelected(report) {
                this.model = report
            },
        }
    }
</script>