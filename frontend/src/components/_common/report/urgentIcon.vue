<template>
    <i class="fas fa-exclamation" :class="{ 'text-danger': isUrgent, 'not-active': !isUrgent }"/>
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