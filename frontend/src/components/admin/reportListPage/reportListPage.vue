<template>
    <div>
        <page-header>
            <breadcrumbs :paths="breadcrumbData"/>
        </page-header>
    </div>
</template>

<style lang="sass" scoped>

</style>

<script>
    import { Breadcrumbs } from '@/components/_common/breadcrumbs'
    import PageHeader from '@/components/_common/pageHeader'
    import { mapState, mapGetters, mapActions } from 'vuex'
    import _ from 'lodash'

    export default {
        components: {
            Breadcrumbs,
            PageHeader,
        },
        computed: {
            ...mapState('Admin/Classroom/Classroom', { classroomRequest: 'request' }),
            ...mapGetters('Admin/Classroom/Classroom', ['classroom']),
            breadcrumbData() {
                return [
                    { name: 'početna', to: { name: 'adminHomePage' } },
                    { name: 'učionice', to: { name: 'adminClassroomListPage' } },
                    {
                        children: _.map(this.allClassrooms, ({ name }) => {
                            return { name: name, to: { name: 'adminClassroomPage', params: { classroomId: name } } }
                        }),
                        currentName: this.classroomId,
                    },
                    {
                       children: [
                           { name: 'opsti', to: { name: 'adminReportListPage', params: { computerId: 'general' } } },
                           ..._.map(this.classroom.computers, ({ computerId }) => {
                               return { name: computerId, to: { name: 'adminReportListPage', params: { computerId: computerId } } }
                           }),
                       ],
                       currentName: this.areGeneralReports ? 'opsti' : this.computerId
                    }
                ]
            },
            classroomId() {
                return this.$route.params.classroomId
            },
            computerId() {
                if (this.areGeneralReports) return null

                return parseInt(this.$route.params.computerId, 10)
            },
        },
        methods: {
            ...mapActions('Admin/Classroom/Classroom', ['fetchClassroom']),
            ...mapActions('Admin/Classroom/AllClassrooms', ['fetchAllClassrooms']),
            getData() {
                this.fetchAllClassrooms()
                this.fetchClassroom({ classroomId: this.classroomId })
            },
        }

    }
</script>