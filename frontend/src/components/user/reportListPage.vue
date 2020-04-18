<template>
    <breadcrumbs
        :paths="breadcrumbData"
    />
</template>

<style lang="sass" scoped>

</style>

<script>
    import { Breadcrumbs } from '@/components/_common/breadcrumbs'

    export default {
        name: 'report-list-page',
        components: {
            Breadcrumbs,
        },
        computed: {
            breadcrumbData() {
                return [
                    { name: 'home', to: { name: 'homePage' } },
                    { name: 'classrooms', to: { name: 'classroomListPage' }},
                    {
                        children: [
                            { name: '704', to: { name: 'classroomPage', params: { classroomId: '704' } } },
                            { name: '718', to: { name: 'classroomPage', params: { classroomId: '718' } } },
                            { name: 'rlaba', to: { name: 'classroomPage', params: { classroomId: 'rlab' } } },
                            { name: 'bim', to: { name: 'classroomPage', params: { classroomId: 'bim' } } },

                            { name: '7042', to: { name: 'classroomPage', params: { classroomId: '704' } } },
                            { name: '7181', to: { name: 'classroomPage', params: { classroomId: '718' } } },
                            { name: 'rlaba1', to: { name: 'classroomPage', params: { classroomId: 'rlab' } } },
                            { name: 'bim1', to: { name: 'classroomPage', params: { classroomId: 'bim' } } },
                        ],
                    },
                    {
                        children: [
                            { name: 'kompjuter 1', to: { name: 'reportListPage', params: { computerId: 1 } } },
                            { name: 'kompjuter 2', to: { name: 'reportListPage', params: { computerId: 2 } } },
                            { name: 'kompjuter 3', to: { name: 'reportListPage', params: { computerId: 3 } } },
                            { name: 'kompjuter 4', to: { name: 'reportListPage', params: { computerId: 4 } } },
                        ]
                    }
                ]
            }
        }
    }
</script>