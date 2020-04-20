<template>
    <i class="el-icon-warning-outline" :class="{ 'text-danger': isUrgent, 'not-active': !isUrgent }"/>
</template>

<style lang="sass" scoped>
    .not-active
        color: #F3F3F3
</style>

<script>
    export default {
        props: {
            isUrgent: Boolean,
        }
    }
</script>