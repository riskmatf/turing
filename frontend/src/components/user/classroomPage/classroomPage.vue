<template>
    <div>
        <breadcrumbs :paths="breadcrumbData"/>
        <h1>This is classroom with id {{ $route.params.classroomId}}</h1>
    </div>
</template>

<style lang="sass">

</style>

<script>
    import Breadcrumbs from '@/components/_common/breadcrumbs'

    export default {
        name: 'classroom-page',
        components: {
            Breadcrumbs,
        },
        computed: {
            breadcrumbData() {
                return [
                    { name: 'classrooms', to: { name: 'classroomListPage' } }, 
                    { 
                        name: `${this.$route.params.classroomId}`, 
                        to: { 
                            name: 'classroomPage', 
                            params: { classroomId: this.$route.params.classroomId } 
                        }
                    }
                ]
            },
        },
    }
</script>