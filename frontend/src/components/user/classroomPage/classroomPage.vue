<template>
    <div class="classroom-container">
        <template v-if="requestStatus === 'success'">
            <div>
                <breadcrumbs :paths="breadcrumbData"/>
            </div>
            <div class="schema">
                <classroom-schema-card
                    :classroom-name="classroom.name"
                    :schema-url="classroom.schemaUrl"
                    :computers="classroom.computers"
                    @computerClick="computerClick"
                    @generalClick="generalClick"
                />
            </div>
            <div class="legend">
                <classroom-schema-legend/>
            </div>
        </template>
        <template v-else-if="requestStatus === 'loading'">
            Loading...
        </template>
        <template v-else-if="requestStatus === 'error'">
            <span class="text-danger">Error: {{ request.message }}</span>
        </template>
    </div>
</template>

<style lang="sass" scoped>
    @import "./src/assets/styles/breakPoints"

    .classroom-container
        display: flex
        flex-direction: column
        height: 100%
        font-size: 13pt
        @media ($mobileBreakPoint)
            font-size: 10pt
        .schema
            width: 90%
            align-self: center
            margin-bottom: 10px
            min-height: 0
            min-width: 0
            @media ($mobileBreakPoint)
                width: 100%
        .legend
            width: 90%
            align-self: center
            @media ($mobileBreakPoint)
                width: 100%
        
</style>

<script>
    import Breadcrumbs from '@/components/_common/breadcrumbs/breadcrumbs'
    import ClassroomSchemaCard from './classroomSchemaCard'
    import ClassroomSchemaLegend from './classroomSchemaLegend'
    import { mapState, mapActions, mapGetters } from 'vuex'
    import _ from 'lodash'

    export default {
        name: 'classroom-page',
        components: {
            Breadcrumbs,
            ClassroomSchemaCard,
            ClassroomSchemaLegend,
        },
        computed: {
            ...mapState('Classroom/Classroom', {classroomRequest: 'request'}),
            ...mapGetters('Classroom/Classroom', ['classroom']),
            ...mapState('Classroom/AllClassrooms', {allClassroomsRequest: 'request'}),
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
                ]
            },
            classroomId() {
                return this.$route.params.classroomId
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
            computerClick(computerId) {
                this.$router.push({ name: 'computerPage', params: { computerId: computerId } })
            },
            generalClick() {
                this.$router.push({ name: 'computerPage', params: { computerId: 'general'} })
            },
            getData() {
                if (['error', 'notInitialized'].includes(this.allClassroomsRequest.status)) {
                    this.fetchAllClassrooms()
                }

                if (this.classroomRequest.status === 'loading') return

                this.fetchClassroom({ classroomId: this.classroomId })
            }
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
                        prevRoute.name === currentRoute.name &&
                        prevRoute.params.classroomId !== currentRoute.params.classroomId
                    ) {
                        this.getData()
                    }
                }
            }
        }
    }
</script>