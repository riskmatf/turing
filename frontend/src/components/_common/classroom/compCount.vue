<template>
    <div class="column">
        <div>Working: <span class="text-success">{{ classroomCompCount.working }}</span></div>
        <div>Broken: <span class="text-danger">{{ classroomCompCount.broken }}</span> </div>
    </div>
</template>

<style lang="sass" scoped>
    .column
        display: flex
        flex-direction: column
</style>

<script>
    export default {
        props: {
            classroomCompCount: Object,
        }   
    }
</script>