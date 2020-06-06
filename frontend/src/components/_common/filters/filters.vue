<template>
    <div>
        <div class="filters desktop">
            <div class="filter-item" v-if="filterClassrooms">
                <div>Ucionice:</div>
                <t-select
                    v-model="classroomsModel"
                    multi-select
                    :items="classroomsFilterOptions"
                    :get-label="getMultiSelectLabel"
                    placeholder="Select classrooms"
                    searchable
                    clearable
                    @close="handleSelectClose"
                />
            </div>
            <div class="filter-item" v-if="filterLocations">
                <div>Lokacije:</div>
                <t-select
                    v-model="locationsModel"
                    multi-select
                    :items="locationsFilterOptions"
                    :get-label="getMultiSelectLabel"
                    placeholder="Select locations"
                    searchable
                    clearable
                    @close="handleSelectClose"
                />
            </div>
            <div class="filter-item" v-if="filterUrgent">
                <div>Da li je kvar hitan?</div>
                <t-select
                        v-model="urgentModel"
                        :items="urgentFilterOptions"
                        :get-label="getUrgentFilterLabel"
                        placeholder="Choose..."
                        clearable
                        @close="handleSelectClose"
                />
            </div>
            <div class="filter-item" v-if="filterComments">
                <div>Da li postoji komentar?</div>
                <t-select
                    v-model="commentModel"
                    :items="commentsFilterOptions"
                    :get-label="getCommentsFilterLabel"
                    placeholder="Choose..."
                    clearable
                    @close="handleSelectClose"
                />
            </div>
            <div class="filter-item" v-if="filterFixed">
                <div>Da li je kvar popravljen?</div>
                <t-select
                        v-model="fixedModel"
                        :items="fixedFilterOptions"
                        :get-label="getFixedFilterLabel"
                        placeholder="Choose..."
                        clearable
                        @close="handleSelectClose"
                    />
            </div>
        </div>
        <div class="mobile">
            <el-button size="mini" @click="isMobileFilterDialogVisible = true">Filteri</el-button>
            <el-dialog fullscreen :visible.sync="isMobileFilterDialogVisible" @close="handleSelectClose">
                <div class="filters">
                    <div class="filter-item" v-if="filterClassrooms">
                        <div>Ucionice:</div>
                        <t-select
                                v-model="classroomsModel"
                                multi-select
                                :items="classroomsFilterOptions"
                                :get-label="getMultiSelectLabel"
                                placeholder="Select classrooms"
                                searchable
                                clearable
                        />
                    </div>
                    <div class="filter-item" v-if="filterLocations">
                        <div>Lokacije:</div>
                        <t-select
                                v-model="locationsModel"
                                multi-select
                                :items="locationsFilterOptions"
                                :get-label="getMultiSelectLabel"
                                placeholder="Select locations"
                                searchable
                                clearable
                        />
                    </div>
                    <div class="filter-item" v-if="filterUrgent">
                        <div>Da li je kvar hitan?</div>
                        <t-select
                                v-model="urgentModel"
                                :items="urgentFilterOptions"
                                :get-label="getUrgentFilterLabel"
                                placeholder="Choose..."
                                clearable
                        />
                    </div>
                    <div class="filter-item" v-if="filterComments">
                        <div>Da li postoji komentar?</div>
                        <t-select
                                v-model="commentModel"
                                :items="commentsFilterOptions"
                                :get-label="getCommentsFilterLabel"
                                placeholder="Choose..."
                                clearable
                        />
                    </div>
                    <div class="filter-item" v-if="filterFixed">
                        <div>Da li je kvar popravljen?</div>
                        <t-select
                                v-model="fixedModel"
                                :items="fixedFilterOptions"
                                :get-label="getFixedFilterLabel"
                                placeholder="Choose..."
                                clearable
                        />
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>

</template>

<style lang="sass" scoped>
    @import 'src/assets/styles/breakPoints'

    .filters
        width: 100%
        overflow-x: auto
        display: grid
        grid-template-columns: repeat(5, minmax(min-content, max-content))
        grid-column-gap: 20px
        @media($mobileBreakPoint)
            grid-template-columns: unset
            grid-template-rows: repeat(5, 1fr)
            grid-row-gap: 20px
        &.desktop
            display: grid
            @media($mobileBreakPoint)
                display: none
        .filter-item
            display: grid
            grid-template-rows: repeat(2, auto)
    .mobile
        width: 100%
        overflow-x: auto
        display: none
        @media ($mobileBreakPoint)
            display: block
</style>

<script>
    import { TSelect } from '@/components/_common/select'
    import _ from 'lodash'

    export default {
        components: {
            TSelect,
        },
        props: {
            value: Object,
            filterClassrooms: Boolean,
            filterLocations: Boolean,
            filterComments: Boolean,
            filterFixed: Boolean,
            filterUrgent: Boolean,
            classroomsFilterOptions: Array,
            locationsFilterOptions: Array,
        },
        data() {
            return {
                hasChanges: false,
                isMobileFilterDialogVisible: false,
            }
        },
        computed: {
            model: {
                get() {
                    return this.value || {}
                },
                set(value) {
                    this.hasChanges = true
                    this.$emit('input', value)
                    this.$emit('change')
                }
            },
            classroomsModel: {
                get() {
                    return this.model.classrooms || []
                },
                set(value) {
                    this.model = { ...this.model, classrooms: value }
                },
            },
            locationsModel: {
                get() {
                    return this.model.locations || []
                },
                set(value) {
                    this.model = { ...this.model, locations: value }
                }
            },
            commentModel: {
                get() {
                    if (_.isNil(this.model.comments)) return null
                    return this.model.comments
                },
                set(value) {
                    this.model = { ...this.model, comments: value }
                }
            },
            fixedModel: {
                get() {
                    if (_.isNil(this.model.fixed)) return null
                    return this.model.fixed
                },
                set(value) {
                    this.model = { ...this.model, fixed: value }
                }
            },
            urgentModel: {
                get() {
                    if (_.isNil(this.model.urgent)) return null
                    return this.model.urgent
                },
                set(value) {
                    this.model = { ...this.model, urgent: value }
                }
            },
            commentsFilterOptions() {
                return [true, false]
            },
            fixedFilterOptions() {
                return [true, false]
            },
            urgentFilterOptions() {
                return [true, false]
            },
        },
        methods: {
            getMultiSelectLabel(filterOption) {
                return filterOption
            },
            getCommentsFilterLabel(filterOption) {
                if (filterOption === null) return ''
                return filterOption ? 'Postoji' : 'Ne postoji'
            },
            getUrgentFilterLabel(filterOption) {
                if (filterOption === null) return ''
                return filterOption ? 'Jeste hitan' : 'Nije hitan'
            },
            getFixedFilterLabel(filterOption) {
                if (filterOption === null) return ''
                return filterOption ? 'Jeste popravljen' : 'Nije popravljen'
            },
            handleSelectClose() {
                if (this.hasChanges) {
                    this.$emit('updateFilters')
                }
                this.hasChanges = false
            },
        },

    }
</script>