<template>
    <div>
        <template v-if="requestStatus === 'success'">
            <breadcrumbs
                    :paths="breadcrumbData"
                    class="breadcrumbs"
            />
        </template>
    </div>
</template>

<style lang="sass" scoped>
    .breadcrumbs
        margin-top: 5px
</style>

<script>
    import { Breadcrumbs } from '@/components/_common/breadcrumbs'
    import { mapState, mapActions, mapGetters } from 'vuex'
    import _ from "lodash";

    export default {
        name: 'report-list-page',
        components: {
            Breadcrumbs,
        },
        computed: {
            ...mapState('Classroom/Classroom', { classroomRequest: 'request' }),
            ...mapGetters('Classroom/Classroom', ['classroom']),
            ...mapState('Classroom/AllClassrooms', { allClassroomsRequest: 'request' }),
            ...mapGetters('Classroom/AllClassrooms', ['allClassrooms']),
            breadcrumbData() {
                return [
                    { name: 'pocetna', to: { name: 'homePage' } },
                    { name: 'ucionice', to: { name: 'classroomListPage' } },
                    {
                        children: _.map(this.allClassrooms, ({ name }) => {
                            return { name: name, to: { name: 'classroomPage', params: { classroomId: name } } }
                        }),
                        currentName: this.classroomId,
                    },
                    {
                       children: [
                           { name: 'opsti', to: { name: 'reportListPage', params: { computerId: 'general' } } },
                           ..._.map(this.classroom.computers, ({ computerId }) => {
                               return { name: computerId, to: { name: 'reportListPage', params: { computerId: computerId } } }
                           }),
                       ],
                        currentName: this.computerId === 'general' ? 'opsti' : this.computerId
                    }
                ]
            },
            classroomId() {
                return this.$route.params.classroomId
            },
            computerId() {
                return this.$route.params.computerId
            },
            requestStatus() {
                if (this.classroomRequest.status === 'error' || this.allClassroomsRequest.status === 'error') {
                    return 'error'
                }
                if (this.classroomRequest.status === 'loading' || this.allClassroomsRequest.status === 'loading') {
                    return 'loading'
                }
                if (this.classroomRequest.status === 'notInitialized' || this.allClassroomsRequest.status === 'notInitialized') {
                    return 'notInitialized'
                }

                return 'success'
            }

        },
        methods: {
            ...mapActions('Classroom/Classroom', ['fetchClassroom']),
            ...mapActions('Classroom/AllClassrooms', ["fetchAllClassrooms"]),
            getData() {
                if (['error', 'notInitialized'].includes(this.allClassroomsRequest.status)) {
                    this.fetchAllClassrooms()
                }

                if (this.classroomRequest.status === 'loading') return

                this.fetchClassroom({ classroomId: this.classroomId })
            },
        },
        watch: {
            $route: {
                immediate: true,
                handler(currentRoute, prevRoute) {
                    if (_.isNil(prevRoute))  {
                        this.getData()
                        return
                    }

                    if (
                        prevRoute.name === currentRoute.name && (
                            prevRoute.params.classroomId !== currentRoute.params.classroomId &&
                            prevRoute.params.computerId !== currentRoute.params.computerId
                        )
                    ) {
                        this.getData()
                    }
                }
            }
        }
    }
</script>