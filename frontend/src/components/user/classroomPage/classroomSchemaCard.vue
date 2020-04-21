<template>
    <el-card class="schema-card" body-style="display: flex; flex-grow: 1; min-height: 0; min-width: 0">
        <template v-slot:header>
            <div class="header">
                <classroom-name :classroom-name="classroomName"/>
                <el-button
                    size="mini"
                    @click="$emit('generalClick')"
                >
                    Opsti kvarovi
                </el-button>
            </div>
        </template>
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
    import { Schema } from '@/components/_common/schema';
    import { ClassroomName } from '@/components/_common/classroom'

    export default {
        name: 'classroomSchemaCard',
        components: {
            Schema,
            ClassroomName,
        },
        props: {
            schemaUrl: String,
            computers: Array,
            classroomName: String,
        },
    }
</script>