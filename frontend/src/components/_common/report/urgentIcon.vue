<template>
    <i class="el-icon-warning-outline" :class="{ 'text-danger': isUrgent, 'not-active': !isUrgent }"/>
</template>

<style lang="sass" scoped>
    .not-active
        color: #A3A3A3
</style>

<script>
    export default {
        props: {
            isUrgent: Boolean,
        }
    }
</script>