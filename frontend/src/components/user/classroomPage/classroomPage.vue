<template>
    <div class="classroom-container">
        <template v-if="request.status === 'success'">
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
        <template v-else-if="request.status === 'loading'">
            Loading...
        </template>
        <template v-else-if="request.status === 'error'">
            <span class="text-danger">Error: {{ request.message }}</span>
        </template>
    </div>
</template>

<style lang="sass" scoped>
    .classroom-container
        display: flex
        flex-direction: column
        height: 100%
        .schema
            width: 90%
            align-self: center
            margin-bottom: 10px
            min-height: 0
            min-width: 0
        .legend
            width: 90%
            align-self: center
</style>

<script>
    import Breadcrumbs from '@/components/_common/breadcrumbs'
    import ClassroomSchemaCard from './classroomSchemaCard'
    import ClassroomSchemaLegend from './classroomSchemaLegend'
    import { mapState, mapActions, mapGetters } from 'vuex'

    export default {
        name: 'classroom-page',
        components: {
            Breadcrumbs,
            ClassroomSchemaCard,
            ClassroomSchemaLegend,
        },
        computed: {
            ...mapState('Classroom/Classroom', ['request']),
            ...mapGetters('Classroom/Classroom', ['classroom']),
            breadcrumbData() {
                return [
                    { name: 'home', to: { name: 'homePage' } },
                    { name: 'classrooms', to: { name: 'classroomListPage' } }, 
                    { 
                        name: `${this.classroomId}`,
                        to: { 
                            name: 'classroomPage', 
                            params: { classroomId: this.$route.params.classroomId } 
                        }
                    }
                ]
            },
            classroomId() {
                return this.$route.params.classroomId
            },
        },
        methods: {
            ...mapActions('Classroom/Classroom', ['fetchClassroom']),
            computerClick(computerId) {
                this.$router.push({ name: 'computerPage', params: { computerId: computerId } })
            },
            generalClick() {
                this.$router.push({ name: 'computerPage', params: { computerId: 'general'} })
            }
        },
        created() {
            if (this.request.status === 'loading') {
                return
            }

            this.fetchClassroom({ classroomId: this.classroomId })
        },
    }
</script>