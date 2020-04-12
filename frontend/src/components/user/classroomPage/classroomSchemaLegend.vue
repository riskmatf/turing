<template>
    <el-card>
        <schema-legend/>
    </el-card>
</template>

<style lang="sass" scoped>

</style>

<script>
    import { SchemaLegend } from '@/components/_common/schema'

    export default {
        name: 'classroom-schema-legend',
        components: {
            SchemaLegend,
        }
    }
</script>