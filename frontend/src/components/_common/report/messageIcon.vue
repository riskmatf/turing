<template>
    <i class="el-icon-chat-line-round" :class="{ 'text-success': hasMessage, 'not-active': !hasMessage }"/>
</template>

<style lang="sass" scoped>
    .not-active
        color: #F3F3F3
</style>

<script>
    export default {
        props: {
            hasMessage: Boolean,
        },
    }
</script>