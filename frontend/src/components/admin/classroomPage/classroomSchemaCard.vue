<template>
    <el-card class="schema-card" body-style="display: flex; flex-grow: 1; min-height: 0; min-width: 0">
        <schema
            :schemaUrl="schemaUrl"
            :computers="computers"
            @computerClick="(computerId) => $emit('computerClick', computerId)" 
        />
    </el-card>
</template>

<style lang="sass" scoped>
    .schema-card
        height: 100%
        display: flex
        flex-direction: column
        .header
            display: flex
            flex-direction: row
            justify-content: space-between
            align-items: center
</style>

<script>
    import { Schema } from '@/components/_common/schema'

    export default {
        name: 'classroomSchemaCard',
        components: {
            Schema,
        },
        props: {
            schemaUrl: String,
            computers: Array,
            classroomName: String,
        },
    }
</script>