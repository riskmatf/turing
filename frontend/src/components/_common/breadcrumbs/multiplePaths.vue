<template>
    <t-select
        v-model="currentSelected"
        :items="paths"
        :get-label="getLabel"
        placeholder="Odaberite ucionicu"
        dropdown-class="breadcrumb-dropdown"
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
        },
        data() {
            return { currentSelected: null}
        },
        created() {
            if (!_.isNil(this.currentLabel)) {
                this.currentSelected = { name: this.currentLabel}
            }
        },
        methods: {
            getLabel(item) {
                if (_.isNil(item)) return ''

                return item.name
            }
        },
        watch: {
            currentSelected() {
                if (_.isNil(_.get(this.currentSelected, 'to', null))) return

                this.$router.push(this.currentSelected.to)
                    .catch(()=>{})
            }
        }
    }
</script>