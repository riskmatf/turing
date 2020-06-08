<template>
    <t-select
        v-model="currentSelected"
        :items="paths"
        :get-search-label="getSearchLabel"
        :get-display-label="getDisplayLabel"
        placeholder="Odaberite učionicu"
        dropdown-class="breadcrumb-dropdown"
        searchable
        @change="redirectFunction"
    />
</template>

<style lang="sass">
    @import "./src/assets/styles/breakPoints"

    .breadcrumb-dropdown
        max-height: 200px
        @media ($mobileBreakPoint)
            max-height: unset
</style>

<script>
    import _ from 'lodash'
    import { TSelect } from '@/components/_common/select'

    export default {
        components: {
            TSelect,
        },
        props: {
            paths: Array,
            currentLabel: [String, Number],
            isLast: Boolean,
        },
        data() {
            return {
                currentSelected: null,
            }
        },
        computed: {
            redirectFunction() {
                if (this.isLast) {
                    return () => {}
                }
                return this.redirect
            }
        },
        created() {
            if (!_.isNil(this.currentLabel)) {
                this.currentSelected = this.paths.find(({ name }) => {
                    return name === this.currentLabel
                })
            }
        },
        methods: {
            getSearchLabel(item) {
                if (_.isNil(item)) return ''

                return item.name
            },
            getDisplayLabel(item) {
                return !_.isNil(item.display) ? item.display : item.name
            },
            redirect() {
                if (_.isNil(_.get(this.currentSelected, 'to', null))) return
                this.$router.push(this.currentSelected.to)
                    .catch(()=>{})
            }
        },
        watch: {
            currentSelected(nextValue, prevValue) {
                if (!this.isLast) {
                    return
                }

                if (_.isNil(prevValue) || nextValue.name !== prevValue.name) {
                    this.redirect()
                }
            }
        }
    }
</script>