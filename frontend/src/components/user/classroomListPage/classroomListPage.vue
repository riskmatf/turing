<template>
    <breadcrumbs :paths="breadcrumbData"/>
</template>

<style lang="sass">

</style>

<script>
    import Breadcrumbs from '@/components/_common/breadcrumbs'
    
    export default {
        name: 'classroom-list-page',
        components: {
            Breadcrumbs,
        },
        computed: {
            breadcrumbData() {
                return [{ name: 'classrooms', to: { name: 'classroomListPage' } }]
            },
        },
    }
</script>