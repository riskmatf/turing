<template>
    <div class="row">
        <div>Working: <span class="text-success">{{ classroomCompCount.working }}</span></div>
        <div class="tabsp">Broken: <span class="text-danger">{{ classroomCompCount.broken }}</span> </div>
    </div>
</template>

<style lang="sass" scoped>
    .row
        display: flex
        flex-direction: row
        justify-content: center
    .tabsp
        padding-left: 10px
</style>

<script>
    export default {
        props: {
            classroomCompCount: Object,
        }   
    }
</script>