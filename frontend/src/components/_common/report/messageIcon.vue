<template>
    <i class="fas fa-comment" :class="{ 'text-success': hasMessage, 'not-active': !hasMessage }"/>
</template>

<style lang="sass" scoped>
    .not-active
        color: #A3A3A3
</style>

<script>
    export default {
        props: {
            hasMessage: Boolean,
        },
    }
</script>