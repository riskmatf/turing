<template>
    <div>
        <!-- Change display name, and change password -->
        <page-header>
            <breadcrumbs :paths="breadcrumbData" class="breadcrumbs"/>
        </page-header>
        <div v-if="request.status === 'success'" class="location-container">
            <el-card class="content-container">Promeni</el-card>
        </div>
        <template v-else-if="request.status === 'loading'">
            <div class="loading">
                Učitavanje...
            </div> 
        </template>
        <div v-else-if="request.status === 'error'" class="text-danger">
            Greška: {{ request.message }}
        </div>
    </div>
</template>

<style lang="sass" scoped>
    .breadcrumbs
        margin-top: 5px
        margin-bottom: 5px
        margin-left: 2px
    .location-container
        display: flex
        flex-direction: column
        align-items: center
        margin-top: 5px
        .content-container
            width: 90%
    .loading
        margin: 20px
</style>

<script>
    import Breadcrumbs from '@/components/_common/breadcrumbs/breadcrumbs'
    import PageHeader from '@/components/_common/pageHeader'
    import { mapState } from 'vuex'


    export default {
        components: {
            Breadcrumbs,
            PageHeader,
        },
        computed: {
            ...mapState('Admin/Classroom/AllClassrooms', ['request']),
            breadcrumbData() {
                return [
                        { name: 'početna', to: {name: 'adminHomePage'}},
                        { name: 'podešavanja', to: { name: 'adminClassroomListPage' } }
                       ]
            },
        }
    }
</script>