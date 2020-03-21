<template>
    <h3 class="no-margin"> {{ classroomName }} </h3>
</template>

<style lang="sass" scoped>
    .no-margin
        margin: 0
</style>

<script>
    export default {
        props: {
            classroomName: String,
        },
    }
</script>