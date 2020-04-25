<template>
    <el-card shadow="never" class="pager-header" body-style="padding: 5px">
        <slot></slot>
    </el-card>
</template>

<style lang="sass" scoped>
    .pager-header
        width: calc(100% + 8px)
        margin-left: -5px
        overflow: unset
</style>

<script>
    export default {
        name: 'page-header',
        props: {
        },
    }
</script>

