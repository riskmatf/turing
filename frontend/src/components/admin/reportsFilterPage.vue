<template>
    <t-select :items="items" v-model="selectedItem" :get-label="getLabel" placeholder="Select" multi-select/>
</template>

<style lang="sass" scoped>

</style>

<script>
    import _ from 'lodash'
    import { TSelect } from '@/components/_common/select'

    export default {
        components: {
            TSelect,
        },
        data() {
            return {
                selectedItem: [],
            }
        },
        computed: {
            items() {
                return ['a', 'b', 'c', 'd', 'e', 'f']
            }
        },
        methods: {
            getLabel(item) {
                return _.isNil(item) ? '' : item
            }
        },
    }
</script>

