<template>
    <div>
        {{JSON.stringify(request)}}
    </div>
</template>

<style lang="sass">

</style>

<script>
    import { mapActions, mapState } from 'vuex'
    export default {
        name: 'classroom-page',
        computed: {
            ...mapState('Classroom/Classroom', ['request']),
        },
        methods: {
            ...mapActions('Classroom/Classroom', ['fetchClassroom']),
        },
        created() {
            this.fetchClassroom({classroomId: this.$route.params.classroomId})
        },
    }
</script>